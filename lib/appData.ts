import { getAccessState, type Branch, type Channel, type Organization, type UserProfile } from '@/lib/access'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

type Category = {
  id: string
  name: string
  organization_id: string
}

type Product = {
  id: string
  category_id: string | null
  organization_id: string
  name: string
  unit_price: number | string | null
}

type ProductStock = {
  id: string
  product_id: string
  branch_id: string
  quantity: number
  created_at: string
  updated_at: string
}

type Sale = {
  id: string
  branch_id: string
  client_id: string | null
  issue_date: string
  status: string | null
  total_amount: number | string | null
  created_at: string | null
}

type SaleDetail = {
  id: string
  sale_id: string
  product_id: string
  quantity: number
  unit_price: number | string
}

type Client = {
  id: string
  name: string
  email: string
  phone_number: string
}

type FinancialTransaction = {
  id: string
  sale_id: string | null
}

type FinancialMovement = {
  id: string
  financial_transaction_id: string
  payment_method_id: string | null
  amount: number | string
  type: string
  created_by: string | null
  created_at: string
}

export type AppContext = {
  user: UserProfile | null
  organization: Organization | null
  branch: Branch | null
  categories: Category[]
  telegramChannel: Channel | null
}

export type InventoryItem = {
  stockId: string | null
  productId: string
  name: string
  categoryId: string | null
  categoryName: string
  quantity: number
  unitPrice: number
  updatedAt: string | null
}

export type SaleListItem = {
  id: string
  issueDate: string
  createdAt: string
  status: string
  total: number
  client: {
    id: string
    name: string
    email: string
    phoneNumber: string
  } | null
  items: Array<{
    productId: string
    productName: string
    quantity: number
    unitPrice: number
    subtotal: number
  }>
}

export type CashMovement = {
  id: string
  createdAt: string
  type: string
  amount: number
  concept: string
  reference: string
}

export type CreateSaleInput = {
  issueDate?: string
  client: {
    name: string
    email?: string
    phoneNumber?: string
  }
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
  }>
}

function toNumber(value: number | string | null | undefined): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value) || 0
  return 0
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function startOfToday(): Date {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

function shortId(id: string): string {
  return id.slice(0, 8).toUpperCase()
}

function normalizeMovementType(type: string): 'ingreso' | 'egreso' {
  if (type === 'out' || type === 'egreso') return 'egreso'
  return 'ingreso'
}

export async function getAppContext(): Promise<AppContext | null> {
  const access = await getAccessState()

  if (!access.authUser) {
    return null
  }

  if (!access.organization) {
    return {
      user: access.profile,
      organization: null,
      branch: null,
      categories: [],
      telegramChannel: access.telegramChannel,
    }
  }

  const { data: categories, error: categoryError } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('organization_id', access.organization.id)
    .order('name')
    .returns<Category[]>()

  if (categoryError) throw categoryError

  return {
    user: access.profile,
    organization: access.organization,
    branch: access.branch,
    categories: categories ?? [],
    telegramChannel: access.telegramChannel,
  }
}

export async function getInventoryOverview() {
  const context = await getAppContext()

  if (!context || !context.organization) {
    return {
      context: null,
      items: [] as InventoryItem[],
      summary: { totalProducts: 0, totalUnits: 0, agotados: 0 },
    }
  }

  const { organization, branch, categories } = context

  const [productsResult, stocksResult] = await Promise.all([
    supabaseAdmin
      .from('products')
      .select('*')
      .eq('organization_id', organization.id)
      .order('name')
      .returns<Product[]>(),
    branch
      ? supabaseAdmin
          .from('product_stocks')
          .select('*')
          .eq('branch_id', branch.id)
          .returns<ProductStock[]>()
      : Promise.resolve({ data: [], error: null } as { data: ProductStock[]; error: null }),
  ])

  if (productsResult.error) throw productsResult.error
  if (stocksResult.error) throw stocksResult.error

  const categoryMap = new Map(categories.map((category) => [category.id, category.name]))
  const stockMap = new Map((stocksResult.data ?? []).map((stock) => [stock.product_id, stock]))

  const items = (productsResult.data ?? []).map((product) => {
    const stock = stockMap.get(product.id)
    return {
      stockId: stock?.id ?? null,
      productId: product.id,
      name: product.name,
      categoryId: product.category_id,
      categoryName: product.category_id ? categoryMap.get(product.category_id) ?? 'Sin categoria' : 'Sin categoria',
      quantity: stock?.quantity ?? 0,
      unitPrice: toNumber(product.unit_price),
      updatedAt: stock?.updated_at ?? null,
    }
  })

  return {
    context,
    items,
    summary: {
      totalProducts: items.length,
      totalUnits: items.reduce((sum, item) => sum + item.quantity, 0),
      agotados: items.filter((item) => item.quantity === 0).length,
    },
  }
}

export async function createInventoryItem(input: {
  name: string
  categoryId?: string | null
  unitPrice?: number
  quantity?: number
}) {
  const context = await getAppContext()

  if (!context?.branch || !context.organization) {
    throw new Error('No branch available for inventory creation')
  }

  if (!input.categoryId) {
    throw new Error('Selecciona o crea una categoria para el producto')
  }

  const { data: product, error: productError } = await supabaseAdmin
    .from('products')
    .insert({
      id: crypto.randomUUID(),
      organization_id: context.organization.id,
      category_id: input.categoryId,
      name: input.name.trim(),
      unit_price: input.unitPrice ?? 0,
    })
    .select('*')
    .single<Product>()

  if (productError) throw productError

  const { error: stockError } = await supabaseAdmin
    .from('product_stocks')
    .insert({
      product_id: product.id,
      branch_id: context.branch.id,
      quantity: input.quantity ?? 0,
    })

  if (stockError) throw stockError

  return product
}

export async function createCategory(input: { name: string }) {
  const context = await getAppContext()
  const name = input.name.trim()

  if (!context?.organization) {
    throw new Error('No hay una organizacion disponible para crear categorias')
  }

  if (!name) {
    throw new Error('El nombre de la categoria es obligatorio')
  }

  const { data: existingCategory, error: existingCategoryError } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('organization_id', context.organization.id)
    .ilike('name', name)
    .maybeSingle<Category>()

  if (existingCategoryError) throw existingCategoryError
  if (existingCategory) return existingCategory

  const { data: category, error: categoryError } = await supabaseAdmin
    .from('categories')
    .insert({
      id: crypto.randomUUID(),
      organization_id: context.organization.id,
      name,
    })
    .select('*')
    .single<Category>()

  if (categoryError) throw categoryError

  return category
}

export async function updateCategory(input: { id: string; name: string }) {
  const context = await getAppContext()
  const name = input.name.trim()

  if (!context?.organization) {
    throw new Error('No hay una organizacion disponible para actualizar categorias')
  }

  if (!input.id || !name) {
    throw new Error('La categoria y el nombre son obligatorios')
  }

  const { data: category, error: categoryError } = await supabaseAdmin
    .from('categories')
    .update({ name })
    .eq('id', input.id)
    .eq('organization_id', context.organization.id)
    .select('*')
    .single<Category>()

  if (categoryError) throw categoryError

  return category
}

export async function deleteCategory(input: { id: string }) {
  const context = await getAppContext()

  if (!context?.organization) {
    throw new Error('No hay una organizacion disponible para eliminar categorias')
  }

  const productsResult = await supabaseAdmin
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', context.organization.id)
    .eq('category_id', input.id)

  if (productsResult.error) throw productsResult.error

  if ((productsResult.count ?? 0) > 0) {
    throw new Error('No se puede eliminar una categoria con productos asociados')
  }

  const { error: categoryError } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', input.id)
    .eq('organization_id', context.organization.id)

  if (categoryError) throw categoryError
}

export async function updateInventoryItem(input: {
  productId: string
  name: string
  categoryId: string
  unitPrice: number
  quantity: number
}) {
  const context = await getAppContext()

  if (!context?.branch || !context.organization) {
    throw new Error('No branch available for inventory update')
  }

  if (!input.productId || !input.name.trim() || !input.categoryId) {
    throw new Error('Producto, nombre y categoria son obligatorios')
  }

  const { error: productError } = await supabaseAdmin
    .from('products')
    .update({
      category_id: input.categoryId,
      name: input.name.trim(),
      unit_price: input.unitPrice,
    })
    .eq('id', input.productId)
    .eq('organization_id', context.organization.id)

  if (productError) throw productError

  const { error: stockError } = await supabaseAdmin
    .from('product_stocks')
    .upsert(
      {
        product_id: input.productId,
        branch_id: context.branch.id,
        quantity: input.quantity,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'product_id,branch_id' }
    )

  if (stockError) throw stockError
}

export async function deleteInventoryItem(input: { productId: string }) {
  const context = await getAppContext()

  if (!context?.branch || !context.organization) {
    throw new Error('No branch available for inventory deletion')
  }

  const saleDetailsResult = await supabaseAdmin
    .from('sale_details')
    .select('id', { count: 'exact', head: true })
    .eq('product_id', input.productId)

  if (saleDetailsResult.error) throw saleDetailsResult.error

  if ((saleDetailsResult.count ?? 0) > 0) {
    throw new Error('No se puede eliminar un producto que ya fue usado en ventas')
  }

  const { error: stockError } = await supabaseAdmin
    .from('product_stocks')
    .delete()
    .eq('product_id', input.productId)
    .eq('branch_id', context.branch.id)

  if (stockError) throw stockError

  const { error: productError } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', input.productId)
    .eq('organization_id', context.organization.id)

  if (productError) throw productError
}

export async function getSalesOverview(options?: { from?: string; to?: string }) {
  const context = await getAppContext()

  if (!context?.branch || !context.organization) {
    return {
      context,
      rows: [] as SaleListItem[],
      summary: { total: 0, count: 0, average: 0, highest: 0 },
      hourly: [] as Array<{ label: string; total: number }>,
      categoryTotals: [] as Array<{ label: string; value: number }>,
      topProducts: [] as Array<{ name: string; quantity: number; income: number }>,
    }
  }

  let salesQuery = supabaseAdmin
    .from('sales')
    .select('*')
    .eq('branch_id', context.branch.id)
    .order('issue_date', { ascending: false })

  if (options?.from) salesQuery = salesQuery.gte('issue_date', options.from)
  if (options?.to) salesQuery = salesQuery.lte('issue_date', options.to)

  const { data: sales, error: salesError } = await salesQuery.returns<Sale[]>()
  if (salesError) throw salesError

  const saleIds = (sales ?? []).map((sale) => sale.id)
  if (saleIds.length === 0) {
    return {
      context,
      rows: [] as SaleListItem[],
      summary: { total: 0, count: 0, average: 0, highest: 0 },
      hourly: [] as Array<{ label: string; total: number }>,
      categoryTotals: [] as Array<{ label: string; value: number }>,
      topProducts: [] as Array<{ name: string; quantity: number; income: number }>,
    }
  }

  const [detailsResult, productsResult, transactionsResult] = await Promise.all([
    supabaseAdmin.from('sale_details').select('*').in('sale_id', saleIds).returns<SaleDetail[]>(),
    supabaseAdmin
      .from('products')
      .select('*')
      .eq('organization_id', context.organization.id)
      .returns<Product[]>(),
    supabaseAdmin
      .from('financial_transactions')
      .select('*')
      .in('sale_id', saleIds)
      .returns<FinancialTransaction[]>(),
  ])

  if (detailsResult.error) throw detailsResult.error
  if (productsResult.error) throw productsResult.error
  if (transactionsResult.error) throw transactionsResult.error

  const transactionIds = (transactionsResult.data ?? []).map((transaction) => transaction.id)
  const movementsResult = transactionIds.length
    ? await supabaseAdmin
        .from('financial_transaction_movements')
        .select('*')
        .in('financial_transaction_id', transactionIds)
        .returns<FinancialMovement[]>()
    : { data: [], error: null as null }

  if (movementsResult.error) throw movementsResult.error

  const categories = context.categories
  const productMap = new Map((productsResult.data ?? []).map((product) => [product.id, product]))
  const categoryMap = new Map(categories.map((category) => [category.id, category.name]))
  const clientIds = [...new Set((sales ?? []).map((sale) => sale.client_id).filter((id): id is string => Boolean(id)))]
  const clientsResult = clientIds.length
    ? await supabaseAdmin.from('clients').select('*').in('id', clientIds).returns<Client[]>()
    : { data: [], error: null as null }

  if (clientsResult.error) throw clientsResult.error

  const clientMap = new Map((clientsResult.data ?? []).map((client) => [client.id, client]))
  const detailsBySaleId = new Map<string, SaleDetail[]>()
  const transactionsBySaleId = new Map<string, FinancialTransaction>()
  const movementsByTransactionId = new Map<string, FinancialMovement[]>()

  for (const detail of detailsResult.data ?? []) {
    const bucket = detailsBySaleId.get(detail.sale_id) ?? []
    bucket.push(detail)
    detailsBySaleId.set(detail.sale_id, bucket)
  }

  for (const transaction of transactionsResult.data ?? []) {
    if (transaction.sale_id) {
      transactionsBySaleId.set(transaction.sale_id, transaction)
    }
  }

  for (const movement of movementsResult.data ?? []) {
    const bucket = movementsByTransactionId.get(movement.financial_transaction_id) ?? []
    bucket.push(movement)
    movementsByTransactionId.set(movement.financial_transaction_id, bucket)
  }

  const hourTotals = new Map<string, number>()
  const categoryTotals = new Map<string, number>()
  const topProducts = new Map<string, { quantity: number; income: number }>()

  const rows = (sales ?? []).map((sale) => {
    const details = detailsBySaleId.get(sale.id) ?? []
    const transaction = transactionsBySaleId.get(sale.id)
    const movements = transaction ? movementsByTransactionId.get(transaction.id) ?? [] : []
    const createdAt =
      sale.created_at ??
      movements
        .map((movement) => movement.created_at)
        .sort()
        .at(-1) ??
      `${sale.issue_date}T00:00:00.000Z`

    const items = details.map((detail) => {
      const product = productMap.get(detail.product_id)
      const quantity = detail.quantity
      const unitPrice = toNumber(detail.unit_price)
      const subtotal = quantity * unitPrice
      const categoryName =
        product?.category_id ? categoryMap.get(product.category_id) ?? 'Sin categoria' : 'Sin categoria'

      categoryTotals.set(categoryName, (categoryTotals.get(categoryName) ?? 0) + subtotal)

      const topProduct = topProducts.get(product?.name ?? 'Producto')
      topProducts.set(product?.name ?? 'Producto', {
        quantity: (topProduct?.quantity ?? 0) + quantity,
        income: (topProduct?.income ?? 0) + subtotal,
      })

      return {
        productId: detail.product_id,
        productName: product?.name ?? 'Producto',
        quantity,
        unitPrice,
        subtotal,
      }
    })

    const detailTotal = items.reduce((sum, item) => sum + item.subtotal, 0)
    const total = toNumber(sale.total_amount) || detailTotal
    const hourLabel = new Date(createdAt).getHours().toString().padStart(2, '0') + ':00'
    hourTotals.set(hourLabel, (hourTotals.get(hourLabel) ?? 0) + total)
    const client = sale.client_id ? clientMap.get(sale.client_id) ?? null : null

    return {
      id: sale.id,
      issueDate: sale.issue_date,
      createdAt,
      status: sale.status ?? 'sin_estado',
      total,
      client: client
        ? {
            id: client.id,
            name: client.name,
            email: client.email,
            phoneNumber: client.phone_number,
          }
        : null,
      items,
    }
  })

  const total = rows.reduce((sum, row) => sum + row.total, 0)

  return {
    context,
    rows,
    summary: {
      total,
      count: rows.length,
      average: rows.length ? total / rows.length : 0,
      highest: rows.reduce((max, row) => Math.max(max, row.total), 0),
    },
    hourly: [...hourTotals.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([label, value]) => ({ label, total: value })),
    categoryTotals: [...categoryTotals.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value })),
    topProducts: [...topProducts.entries()]
      .sort((a, b) => b[1].income - a[1].income)
      .map(([name, value]) => ({ name, quantity: value.quantity, income: value.income })),
  }
}

export async function createSale(input: CreateSaleInput) {
  const context = await getAppContext()

  if (!context?.branch || !context.organization || !context.user) {
    throw new Error('No hay una sucursal activa para registrar la venta')
  }

  const clientName = input.client.name.trim()
  if (!clientName) {
    throw new Error('El cliente es obligatorio')
  }

  const normalizedItems = input.items.map((item) => ({
    productId: item.productId,
    quantity: Math.trunc(Number(item.quantity)),
    unitPrice: Number(item.unitPrice),
  }))

  if (normalizedItems.length === 0) {
    throw new Error('Agrega al menos un producto a la venta')
  }

  if (normalizedItems.some((item) => !item.productId || item.quantity <= 0 || item.unitPrice < 0)) {
    throw new Error('Cada producto debe tener cantidad positiva y precio valido')
  }

  const productIds = [...new Set(normalizedItems.map((item) => item.productId))]
  const [productsResult, stocksResult] = await Promise.all([
    supabaseAdmin
      .from('products')
      .select('*')
      .eq('organization_id', context.organization.id)
      .in('id', productIds)
      .returns<Product[]>(),
    supabaseAdmin
      .from('product_stocks')
      .select('*')
      .eq('branch_id', context.branch.id)
      .in('product_id', productIds)
      .returns<ProductStock[]>(),
  ])

  if (productsResult.error) throw productsResult.error
  if (stocksResult.error) throw stocksResult.error

  const productMap = new Map((productsResult.data ?? []).map((product) => [product.id, product]))
  const stockMap = new Map((stocksResult.data ?? []).map((stock) => [stock.product_id, stock]))

  for (const item of normalizedItems) {
    const product = productMap.get(item.productId)
    if (!product) {
      throw new Error('Uno de los productos no pertenece a tu negocio')
    }

    const stock = stockMap.get(item.productId)
    if (!stock || stock.quantity < item.quantity) {
      throw new Error(`Stock insuficiente para ${product.name}`)
    }
  }

  const saleId = crypto.randomUUID()
  const totalAmount = normalizedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const phoneNumber = input.client.phoneNumber?.trim() || 'Sin telefono'
  const email = input.client.email?.trim() || `${saleId}@qypu.local`

  let client: Client | null = null
  if (input.client.phoneNumber?.trim()) {
    const existingClientResult = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('phone_number', input.client.phoneNumber.trim())
      .limit(1)
      .maybeSingle<Client>()

    if (existingClientResult.error) throw existingClientResult.error
    client = existingClientResult.data ?? null
  }

  if (!client) {
    const { data: newClient, error: clientError } = await supabaseAdmin
      .from('clients')
      .insert({
        id: crypto.randomUUID(),
        name: clientName,
        email,
        phone_number: phoneNumber,
      })
      .select('*')
      .single<Client>()

    if (clientError) throw clientError
    client = newClient
  }

  const { error: saleError } = await supabaseAdmin.from('sales').insert({
    id: saleId,
    client_id: client.id,
    branch_id: context.branch.id,
    issue_date: input.issueDate || toIsoDate(new Date()),
    status: 'valid',
    total_amount: totalAmount,
  })

  if (saleError) throw saleError

  const saleDetails = normalizedItems.map((item) => ({
    id: crypto.randomUUID(),
    sale_id: saleId,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
  }))

  const { error: detailError } = await supabaseAdmin.from('sale_details').insert(saleDetails)
  if (detailError) {
    await supabaseAdmin.from('sales').delete().eq('id', saleId)
    throw detailError
  }

  try {
    for (const item of normalizedItems) {
      const stock = stockMap.get(item.productId)
      if (!stock) throw new Error('No se encontro stock para descontar')

      const { data: updatedStock, error: stockError } = await supabaseAdmin
        .from('product_stocks')
        .update({
          quantity: stock.quantity - item.quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', stock.id)
        .eq('quantity', stock.quantity)
        .gte('quantity', item.quantity)
        .select('id')
        .maybeSingle<{ id: string }>()

      if (stockError) throw stockError
      if (!updatedStock) {
        throw new Error(`El stock de ${productMap.get(item.productId)?.name ?? 'un producto'} cambio. Revisa e intenta de nuevo.`)
      }
    }
  } catch (stockUpdateError) {
    await supabaseAdmin.from('sale_details').delete().eq('sale_id', saleId)
    await supabaseAdmin.from('sales').delete().eq('id', saleId)
    throw stockUpdateError
  }

  const { data: transaction, error: transactionError } = await supabaseAdmin
    .from('financial_transactions')
    .insert({ id: crypto.randomUUID(), sale_id: saleId })
    .select('*')
    .single<FinancialTransaction>()

  if (transactionError) throw transactionError

  const { error: movementError } = await supabaseAdmin.from('financial_transaction_movements').insert({
    id: crypto.randomUUID(),
    financial_transaction_id: transaction.id,
    amount: totalAmount,
    type: 'in',
    created_by: context.user.id,
  })

  if (movementError) throw movementError

  return { saleId }
}

export async function getCashOverview(options?: { from?: string }) {
  const context = await getAppContext()

  if (!context?.branch || !context.organization) {
    return {
      context,
      movimientos: [] as CashMovement[],
      ingresos: 0,
      egresos: 0,
      balance: 0,
      weekBalance: 0,
    }
  }

  const fromDate = options?.from ?? toIsoDate(startOfToday())

  const { rows: salesRows } = await getSalesOverview({ from: fromDate })
  const saleIds = salesRows.map((sale) => sale.id)

  if (saleIds.length === 0) {
    return {
      context,
      movimientos: [] as CashMovement[],
      ingresos: 0,
      egresos: 0,
      balance: 0,
      weekBalance: 0,
    }
  }

  const { data: transactions, error: transactionError } = await supabaseAdmin
    .from('financial_transactions')
    .select('*')
    .in('sale_id', saleIds)
    .returns<FinancialTransaction[]>()

  if (transactionError) throw transactionError

  const transactionIds = (transactions ?? []).map((transaction) => transaction.id)
  if (transactionIds.length === 0) {
    return {
      context,
      movimientos: [] as CashMovement[],
      ingresos: 0,
      egresos: 0,
      balance: 0,
      weekBalance: 0,
    }
  }

  const { data: movements, error: movementError } = await supabaseAdmin
    .from('financial_transaction_movements')
    .select('*')
    .in('financial_transaction_id', transactionIds)
    .returns<FinancialMovement[]>()

  if (movementError) throw movementError

  const saleById = new Map(salesRows.map((sale) => [sale.id, sale]))
  const transactionById = new Map((transactions ?? []).map((transaction) => [transaction.id, transaction]))
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - 6)
  weekStart.setHours(0, 0, 0, 0)

  const movimientos = (movements ?? [])
    .map((movement) => {
      const transaction = transactionById.get(movement.financial_transaction_id)
      const sale = transaction?.sale_id ? saleById.get(transaction.sale_id) : null
      const type = normalizeMovementType(movement.type)

      return {
        id: movement.id,
        createdAt: movement.created_at,
        type,
        amount: toNumber(movement.amount),
        concept: type === 'egreso' ? 'Egreso registrado' : 'Venta registrada',
        reference: sale ? shortId(sale.id) : shortId(movement.financial_transaction_id),
      }
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const ingresos = movimientos
    .filter((movement) => movement.type === 'ingreso')
    .reduce((sum, movement) => sum + movement.amount, 0)
  const egresos = movimientos
    .filter((movement) => movement.type === 'egreso')
    .reduce((sum, movement) => sum + movement.amount, 0)
  const weekBalance = movimientos
    .filter((movement) => new Date(movement.createdAt) >= weekStart)
    .reduce((sum, movement) => sum + (movement.type === 'egreso' ? -movement.amount : movement.amount), 0)

  return {
    context,
    movimientos,
    ingresos,
    egresos,
    balance: ingresos - egresos,
    weekBalance,
  }
}

export async function getReportOverview() {
  const from = new Date()
  from.setDate(from.getDate() - 6)
  from.setHours(0, 0, 0, 0)

  const salesOverview = await getSalesOverview({ from: toIsoDate(from), to: toIsoDate(new Date()) })
  const cashOverview = await getCashOverview({ from: toIsoDate(from) })

  const dayLabels = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(from)
    date.setDate(from.getDate() + index)
    return {
      iso: toIsoDate(date),
      label: new Intl.DateTimeFormat('es-PE', { weekday: 'short' }).format(date),
    }
  })

  const salesByDay = new Map<string, number>()
  for (const sale of salesOverview.rows) {
    salesByDay.set(sale.issueDate, (salesByDay.get(sale.issueDate) ?? 0) + sale.total)
  }

  const expensesByDay = new Map<string, number>()
  for (const movement of cashOverview.movimientos) {
    if (movement.type !== 'egreso') continue
    const day = movement.createdAt.slice(0, 10)
    expensesByDay.set(day, (expensesByDay.get(day) ?? 0) + movement.amount)
  }

  const daily = dayLabels.map((day) => ({
    day: day.label,
    sales: salesByDay.get(day.iso) ?? 0,
    expenses: expensesByDay.get(day.iso) ?? 0,
  }))

  return {
    context: salesOverview.context,
    summary: {
      sales: salesOverview.summary.total,
      expenses: cashOverview.egresos,
      net: salesOverview.summary.total - cashOverview.egresos,
      bestDay:
        daily.reduce((best, current) => (current.sales > best.sales ? current : best), {
          day: '-',
          sales: 0,
          expenses: 0,
        }).day,
    },
    daily,
    topProducts: salesOverview.topProducts,
  }
}
