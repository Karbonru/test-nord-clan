import React from 'react';
import { connect } from 'react-redux';
import './Account.css';
import { DB } from '../../lib/firebase.js'
import { Table, Input, Button, Icon } from 'antd';

class AccountList extends React.Component {
  state = {
    searchText: '',
  };

  loadData = () => {
    DB.ref(`/users/${this.props.user.uid}`).on('value', d => {
      const data = d.val()
      this.props.setBalance(data.balance)
      let arr = []
      for(let id in data.payments) {
        data.payments[id].id = id
        data.payments[id].key = id
        arr.push(data.payments[id])
      }
      this.props.setPayments(arr)
    })
  }

  componentDidMount() {
    this.loadData()
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <div>{text}</div>
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const { payments } = this.props
    const columns = [
      {
        title: 'Название',
        dataIndex: 'title',
        key: 'id',
        width: '30%',
        sorter: (a, b) => a.title.length - b.title.length,
        ...this.getColumnSearchProps('title'),
      },
      {
        title: 'Комментарий',
        dataIndex: 'comment',
        key: 'id' + 'com',
        sorter: (a, b) => a.comment.length - b.comment.length,
        ...this.getColumnSearchProps('comment'),
      },
      {
        title: 'Статус',
        dataIndex: 'status',
        key: 'id' + 'st',
        width: '20%',
        sorter: (a, b) => a.status.length - b.status.length,
        ...this.getColumnSearchProps('status'),
      },
      {
        title: 'Сумма',
        dataIndex: 'summ',
        key: 'id' +'summ',
        width: '20%',
        sorter: (a, b) => a.summ.length - b.summ.length,
        ...this.getColumnSearchProps('summ'),
      }
    ];

    return (
      <div>
        <Table columns={columns} dataSource={this.props.user ? payments : []} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: ownProps.user = state.default.user,
    payments: ownProps.payments = state.default.payments,
  }
}

const mapActions = (dispatch, ownProps) => {
  return {
    setBalance: (balance) => {
      dispatch({type:'SET_BALANCE', balance})
    },
    setPayments: (payments) => {
      dispatch({type:'SET_PAYMENTS', payments})
    }
  }
}

export default connect(mapStateToProps, mapActions)( AccountList);