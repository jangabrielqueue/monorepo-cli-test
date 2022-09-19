import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  tableWrapper: {
    width: '100%',
    margin: '0 0 0 0',
    fontSize: '12px',
    border: '1px solid #bbb',
    '& tr:first-child': {
      borderBottom: '1px solid #bbb'
    },
    '& tr:nth-child(2n + 2)': {
      backgroundColor: '#efefef'
    }
  },
  contentWrapper: {
    witdh: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 0'
  }
})
const TableComponent = ({ columns, data, noContentDisplay, showContent }) => {
  const classes = useStyles()

  return (
    <div className={classes.tableWrapper}>
      <table style={{ width: '100%', display: 'table', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((data, i) => (
              <th
                key={`th-${i}`}
                style={{ width: data.width ? data.width : '' }}
              >
                {data.name}
              </th>
            ))}
          </tr>
        </thead>
        {data.map((data, iD) => {
          return (
            <tr key={`tr${iD}`}>
              {columns.map((column, iC) => {
                if (data[column.name] || data[column.selector]) {
                  return (
                    <td
                      key={`${iD}-${iC}`}
                      style={{ width: column.width ? column.width : '', textAlign: column.align ? column.align : 'center' }}
                    >
                      {column.selector ? data[column.selector] : data[column.name]}
                    </td>
                  )
                } else {
                  return (
                    <td
                      key={`${iD}-${iC}`}
                      style={{ width: column.width ? column.width : '', textAlign: column.align ? column.align : 'center' }}
                    >
                      -
                    </td>
                  )
                }
              })}
            </tr>
          )
        })}
      </table>
      {
        showContent && (
          <div className={classes.contentWrapper}>
            {noContentDisplay}
          </div>)
      }
    </div>
  )
}

export default TableComponent
