import { Select, Spin } from "antd"
import { useState, useCallback, useRef } from "react"
import api from "../lib/api"
import { debounce } from "lodash"

const Option = Select.Option

function SearchUser({ onChange, value }) {
  const lastFetchIdRef = useRef(0)
  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState([])

  const fetchUser = useCallback(debounce((value) => {
    lastFetchIdRef.current += 1
    const fetchId = lastFetchIdRef.current
    setFetching(true)
    setOptions([])

    if (value.length !== 0) {
      api.request({
        url: `/search/users?q=${value}`,
        method: "GET"
      }).then(res => {
        if (fetchId !== lastFetchIdRef.current) {
          return
        }
        const data = res.data.items.map(user => ({ text: user.login, value: user.login }))
        setFetching(false)
        setOptions(data)
      })
    } else {
      setFetching(false)
    }
  }, 400), [])

  const handleChange = (value) => {
    setOptions([])
    setFetching(false)
    onChange(value)
  }

  return (
    <Select
      style={{width: 200}}
      showSearch={true}
      notFoundContent={fetching ? <Spin size="small" /> : <span>nothing</span>}
      filterOption={false}
      placeholder="create"
      value={value}
      onChange={handleChange}
      onSearch={fetchUser}
      allowClear={true}
    >
      {
        options.map(option => (
          <Option value={option.value} key={option.value}>{option.text}</Option>
        ))
      }
    </Select>)
}


export default SearchUser
