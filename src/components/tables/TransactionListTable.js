import ListTable from "./ListTable";
import * as T from "../../reducer/action";

export default function TransactionListTable(props) {
  const {
    dispatch,
    state: {
      transactionLog: { list, status, filter }
    }
  } = props;
  const filterElem = (
    <span>
      <label htmlFor="pxq_pgck_filter_type">Type:</label>
      <select
        id="pxq_pgck_filter_type"
        value={filter}
        onChange={(e) =>
          dispatch(
            T.createAction(T.TRANSACTION_LOG, { filter: e.target.value })
          )
        }
        className="pxq_pgck_list_table__filter"
      >
        <option value="">Both</option>
        <option value="credit">Addition</option>
        <option value="debit">Subtraction</option>
      </select>
    </span>
  );
  return (
    <ListTable
      dispatch={dispatch}
      list={filter ? list.filter((item) => filter === item.status) : list}
      actionType={T.TRANSACTION_LOG}
      status={status}
      ajaxKey="pxq_pgck_get_transactions1"
      ajaxFailMsg="Failed to load transactions. Please refresh!"
      filter={filterElem}
      onLoaded={(data) =>
        dispatch(T.createAction(T.APP, { balance: data.data.balance }))
      }
      colsCount={4}
      renderTableHead={() => (
        <tr>
          <th key="id">ID</th>
          <th key="date">Date</th>
          <th key="detail">Description</th>
          <th key="credits">Credits</th>
        </tr>
      )}
      renderTableBody={(items) =>
        items.map((obj) => (
          <tr key={obj.id}>
            <td key="id">{obj.id}</td>
            <td key="date">{obj.created_at}</td>
            <td key="detail">{obj.detail}</td>
            <td
              key="credits"
              className={
                "credit" === obj.status ? "pxq_pgck_success" : "pxq_pgck_error"
              }
            >
              {"credit" === obj.status ? "+" : "-"}
              {obj.credits}
            </td>
          </tr>
        ))
      }
    />
  );
}
