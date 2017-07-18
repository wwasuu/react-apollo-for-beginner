import React from 'react'
import { Col, Table, Avatar, Popconfirm } from 'antd' 
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import { queryPokemon } from '../queries/pokemon'
import { deleteMutation } from '../mutations/pokemon'
import { fetchPokemonSuccess } from '../actions/pokemon'

class ListItem extends React.Component {
  columns = [{
    title: '',
    key: 'avatar',
    render: (text, record) => (
      <Avatar size="large" src={`http://assets.pokemon.com/assets/cms2/img/pokedex/full/${record.id}.png`} />
    )
  }, {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: 'English Name',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: 'Japanese Name',
    dataIndex: 'nameJP',
    key: 'nameJP',
  }, {
    title: 'Type',
    key: 'type',
    render: (text, record) => (
      <div>{`${record.type.join(', ')}`}</div>
    )
  }, {
    title: 'Species',
    dataIndex: 'species',
    key: 'species',
  }, {
    title: 'Generation',
    dataIndex: 'generationId',
    key: 'generationId',
  }, {
    title: '',
    key: 'action',
    render: (text, record) => (
      <span>
        <Link to={`pokemons/${record.id}`}>View</Link>
        <span className="ant-divider" />
        <Popconfirm title="Sure to delete?" okText="Yes" cancelText="No" onConfirm={() => this.deleteData(`${record.id}`)}>
          <a>Delete</a>
        </Popconfirm>
      </span>
    ),
  }]
  deleteData = (id) => {
    this.props.mutate({ variables: { id } })
      .then(() => this.props.data.refetch())
  }

  render() {
    const { 
      loading,
      payload
    } = this.props
    if (loading) {
      return (
        <div>
          <Col span={20} offset={2}>
            Loading
          </Col>
        </div>
      )
    }
    return (
      <div>
        {
          <Col span={20} offset={2}>
            <Table dataSource={payload.data} columns={this.columns} />
          </Col>
        }
      </div>
    )
  }
}

const mapStateToprops = state => ({
  pokemons: state.pokemons
})

const mapDispatchToprops = dispatch => ({
  fetchPokemonSuccess: (payload) => dispatch(fetchPokemonSuccess(payload)),
})

const ListItemApolloWrapped  = compose(
  graphql(queryPokemon, {
    props: ({ ownProps, data: { loading, payload } }) => ({
      loading,
      payload
    })
  }),
  graphql(deleteMutation),
)(ListItem);

export default connect(mapStateToprops, mapDispatchToprops)(ListItemApolloWrapped)
