// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./Allowance.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CommonPot is Allowance {

    using SafeMath for uint;
    using Strings for uint256;

    address[] private contributors ;
    mapping(address => uint) private balances;
    uint private totalBalance = 0;

    event Deposit(address sender, uint amount);
    event Withdrawal(address receiver, string amount);

    receive() external payable {
        require(msg.value > 0, "No money sent");
        balances[msg.sender] = SafeMath.add(balances[msg.sender], msg.value);
        totalBalance = SafeMath.add(totalBalance, msg.value);
        if (!contributorsPresent(msg.sender)) {
            contributors.push(msg.sender);
        }
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw() public isOwner {
        //prevent someone who has no interest from emptying contract's balance
        require(balances[msg.sender] > 0, "Insufficient funds");
        uint256 quotient;
        uint256 remainder;
        string memory result;
        for (uint i = 0; i < contributors.length; i++) {
            (quotient, remainder, result) = division(totalBalance, balances[contributors[i]], 10);
            emit Withdrawal(contributors[i], result);
            balances[contributors[i]] = 0;
        }
        totalBalance = 0;
    }

    function contributorsPresent(address adr) private view returns (bool) {
        for (uint i = 0; i < contributors.length; i++) {
            if (contributors[i] == adr) {
                return true;
            }
        }
        return false;
    }

    function getCurrentGlobalBalance() public view returns (uint) {
        return totalBalance;
    }

    function division(uint256 decimalPlaces, uint256 numerator, uint256 denominator) internal pure returns(uint256 quotient, uint256 remainder, string memory result) {
        uint256 factor = 10**decimalPlaces;
        quotient  = numerator / denominator;
        bool rounding = 2 * ((numerator * factor) % denominator) >= denominator;
        remainder = (numerator * factor / denominator) % factor;
        if (rounding) {
            remainder += 1;
        }
        result = string(abi.encodePacked(quotient.toString(), '.', numToFixedLengthStr(decimalPlaces, remainder)));
    }

    function numToFixedLengthStr(uint256 decimalPlaces, uint256 num) pure internal returns(string memory result) {
        bytes memory byteString;
        for (uint256 i = 0; i < decimalPlaces; i++) {
            uint256 remainder = num % 10;
            byteString = abi.encodePacked(remainder.toString(), byteString);
            num = num/10;
        }
        result = string(byteString);
    }
}
