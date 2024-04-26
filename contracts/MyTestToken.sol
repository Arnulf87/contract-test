// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract MyTestToken {
    string private _name = "MyTestToken";
    string private _symbol = "MTT";
    uint8 private _decimals = 2;
    uint256 private _totalSupply;

    mapping (address => uint256) private _balances;
    mapping (address => mapping(address => uint256)) private _allowances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    constructor () {
        uint256 _supply = 2100000 * 10** _decimals;
        _balances[msg.sender] = _supply;
        _totalSupply = _supply;
        emit Transfer(address(0), msg.sender, _supply);
    }


    function name() public view returns (string memory) {
        return _name;
    }
    function symbol() public view returns (string memory) {
        return _symbol;
    }
    function decimals() public view returns (uint8) {
        return _decimals;
    }
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
    function balanceOf(address _owner) public view returns (uint256) {
        return _balances[_owner];
    }
    function transfer(address _to, uint256 _value) public returns (bool) {
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(_allowances[_from][msg.sender] >= _value, "You are not allowed to spend this amount of tokens!");
        _balances[_from] -= _value;
        _balances[_to] += _value;
        _allowances[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
    function approve(address _spender, uint256 _value) public returns (bool) {
        _allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    function allowance(address _owner, address _spender) public view returns (uint256) {
        return _allowances[_owner][_spender];
    }


}
