import React from "react";
import ReactDOM from "react-dom";
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data, Filters } from "react-data-grid-addons";

const defaultColumnProperties = {
    sortable: true,
    filterable: true,
    width: 400
  };
  const selectors = Data.Selectors;
  const {
    NumericFilter,
    AutoCompleteFilter,
  } = Filters;

const columns = [
  { key: "id", name: "ID", editable: true, sortDescendingFirst: true,
  filterRenderer: NumericFilter },
  { key: "title", name: "Title", editable: true ,
  filterRenderer: AutoCompleteFilter},
  { key: "complete", name: "Complete", editable: true ,
  filterRenderer: NumericFilter}
].map(c => ({ ...c, ...defaultColumnProperties }));

const rows = [
  { id: 0, title: "Car", complete: 20 },
  { id: 1, title: "Tent", complete: 40 },
  { id: 2, title: "House", complete: 60 },
  { id: 3, title: "Builing", complete: 20 },
  { id: 4, title: "Parking", complete: 40 },
  { id: 5, title: "Kitchen", complete: 60 }
];




class TestTable extends React.Component {
    constructor(props){
        super(props);
        this.state={
            rows: this.props.initialRows,
            filters:{}
        }
        this.sortRows = this.sortRows.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.onfilterchange = this.onfilterchange.bind(this);
        this.onfilterclear=this.onfilterclear.bind(this);
    }

  onchangeGrid(rows){
      this.setState({rows})
  }

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    this.setState(state => {
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
  };

  sortRows = (initialRows, sortColumn, sortDirection) => 
  {
      const {rows} = this.state;
    const comparer = (a, b) => {
      if (sortDirection === "ASC") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else if (sortDirection === "DESC") {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    };
    return sortDirection === "NONE" ? initialRows : [...rows].sort(comparer);
}



 handleFilterChange = filter => {
    const {filters} = this.state;
    const newFilters = { ...filters };
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    console.log(newFilters);
    
    return newFilters;
  };
  
  getValidFilterValues(rows, columnId) {
    return rows
      .map(r => r[columnId])
      .filter((item, i, a) => {
          console.log(item);
        return i === a.indexOf(item);
      });
  }
  
  getRows(rows, filters) {
    return selectors.getRows({ rows, filters });
  }

  onfilterchange(values){
      this.setState({filters:values})
  }
  onfilterclear(){
      this.setState({filter:{}})
  }
  render() {
      const { initialRows} = this.props;
      const { rows ,filters} = this.state;
      const filteredRows = this.getRows(rows, filters);
    return (
      <ReactDataGrid
        columns={columns}
        rowGetter={i => filteredRows[i]}
        rowsCount={filteredRows.length}
        onGridRowsUpdated={this.onGridRowsUpdated}
        enableCellSelect={true}
        minHeight={500}
        onGridSort={(sortColumn, sortDirection) =>
            this.onchangeGrid(this.sortRows(initialRows, sortColumn, sortDirection))
          }
          toolbar={<Toolbar enableFilter={true} />}
          onAddFilter={filter => this.onfilterchange(this.handleFilterChange(filter))}
          onClearFilters={() => this.onfilterclear()}
          getValidFilterValues={columnKey => this.getValidFilterValues(rows, columnKey)}
      />
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<TestTable initialRows={rows} />, rootElement);
