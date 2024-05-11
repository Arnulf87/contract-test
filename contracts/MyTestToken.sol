// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.7;

/**
 * @dev This is a simple smart contract based on
 * the ERC-20 standard, which implements 
 * the main functions of this standard.
 */

contract MyTestToken {
    // Name of the token.
    string private _name = "MyTestToken";
    
    // Symbol of the token.
    string private _symbol = "MTT";

    // the number of decimals
    uint8 private _decemals = 18;
    
    // Total amount of tokens in existence.
    uint256 private _totalSupply;

    mapping (address => uint256) private _balances;
    
    mapping (address => mapping(address => uint256)) private _allowances;

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     */
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    
    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    constructor () {
        uint256 _supply = 21000 ether;
        
        _balances[msg.sender] = _supply;
        _totalSupply = _supply;
        
        emit Transfer(address(0), msg.sender, _supply);
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei.
     */
    function decimals() public view returns (uint8) {
        return _decemals;
    }

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address _owner) public view returns (uint256) {
        return _balances[_owner];
    }

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     * 
     * Requirements:
     * - The amount of token of the sender
     * - Address `to` is not equal to `ZeroAddress`
     *
     * @param _to     address where tokens will be transfer.
     *
     * @param _value  amount of tokens will be transfer.
     */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_balances[msg.sender] >= _value, "There are not enough tokens in the account!");
        require(_to != address(0), "Wrong addres!");

        _balances[msg.sender] -= _value;
        _balances[_to] += _value;
        
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    /**
     * @dev Moves a `value` amount of tokens from `_from` to `_to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     * - is the address `_from` allowed to moved `_value` to the address `_to`
     * - is the balance `_from` greater than or equal to `_value`
     * - is the balance `_from` not equal zero
     * - Address `to` is not equal to `ZeroAddress`
     *
     * @param _from   address from which the tokens will be moved.
     *
     * @param _to     address where tokens will be moved.
     *
     * @param _value  amount of tokens will be moved.
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(_allowances[_from][msg.sender] >= _value, "You are not allowed to spend this amount of tokens!");
        require(_balances[_from] >= _value, "Not enough funds!");
        require(_balances[_from] != 0, "Not enough funds!");
        require(_to != address(0), "Wrong addres!");

        _balances[_from] -= _value;
        _balances[_to] += _value;
        _allowances[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value);
        return true;
    }

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Approval} event.
     * 
     * Requirements:
     * - Address `_spender` is not equal to `ZeroAddress`
     * - is the balance `msg.sender` not equal zero
     * 
     * @param _spender the address of someone who is a `spender`.
     *
     * @param _value amount of tokens that are approved.
     */
    function approve(address _spender, uint256 _value) public returns (bool) {
        require(_spender != address(0), "Wrong addres!");
        require(_balances[msg.sender] != 0, "Not enough funds");

        _allowances[msg.sender][_spender] = _value;
        
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * @param _owner the address of someone who is a `owner`.
     *
     * @param _spender the address of someone who is a `spender`.
     */
    function allowance(address _owner, address _spender) public view returns (uint256) {
        return _allowances[_owner][_spender];
    }
}
