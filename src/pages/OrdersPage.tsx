const MOCK_ORDERS = [
  { id: 'ORD-1001', customer: 'Contoso Ltd', status: 'Open', total: '$1,240.00' },
  { id: 'ORD-1002', customer: 'Fabrikam Inc', status: 'Shipped', total: '$89.50' },
  { id: 'ORD-1003', customer: 'Northwind Traders', status: 'Processing', total: '$412.00' },
]

export function OrdersPage() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Order management</h1>
        <p className="lead">
          Mock order list — visible only with the <strong>OrderManager</strong> Entra app role.
        </p>
      </header>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ORDERS.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.status}</td>
                <td>{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
