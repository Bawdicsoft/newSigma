// SPDX-License-Identifier: NONE
pragma solidity ^0.8.0;



import "hardhat/console.sol";
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

}

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract SigmaV3 {
    // ** variables ** 
    uint24 public immutable poolFee;
    address admin;
    address FeeCollector;
    uint rewardPool;
    uint marketing;
    uint Development;
    uint LiquidityPool;
    uint public currentId = 0;
    uint divider = 10000; 
    IERC20 usdt;
    IERC20 SigmaToken;
    uint[] public fee = [0,10e18,25e18,50e18,100e18,200e18,400e18 ];
    uint[] public rewardsDestribution = [0, 1500,1000,2000,500,5000 ];
    // uint[] uplineRewardDistribution = [0,1e17,375e16,125e17,15e18];
    uint[] uplineRewardDistribution = [0,1800,1500,1200,1000,600,400,
                            200,200,150,150,150,150,150,150,200,2000];

    uint PassiveIncome;
    uint RewardPool;
    uint PlatformFee;
    uint PlatinumUsers;
    uint into;
    uint TotalEarningOfAllUsers;
    // ** structs ** 
    struct User{
        uint DRef;
        uint purchased;
        uint earnedRewards;
        uint started;
        uint RefUnclaimedRewards;
        uint passiveDueUnclaimed;
        uint passiveDueClaimed;
        uint passiveLastClaimed;
        uint lastWithdrawl; 
        uint counter;
    }
    // Events 
    event NewUser(uint _user,uint _ref,uint _time);
    // ** mappings ** 
    mapping(uint => User) internal users;
    mapping(uint => address) public IdToAddress;
    mapping(address => uint) internal Id;
    mapping(address => bool) public exists;
    mapping(address => bool) internal TierMaster;
    mapping(address => uint) internal PassiveClaimed;
    mapping(address => uint) internal distance;
    mapping(address => mapping(uint => uint[])) public team;
    
    
    // ** modifiers ** 
    // ** constructor **

    constructor(address _admin, address _feeCollector, 
        IERC20 _usdt, IERC20 _SigmaToken, 
        address _poolAddress, uint24 _poolFee){
        Id[_admin] = currentId;
        IdToAddress[currentId] =  _admin;
        FeeCollector = _feeCollector;
        exists[_admin] = true;
        currentId=currentId+1;
        admin= _admin;
        TierMaster[_admin] = true;
        distance[_admin] = 0;
        usdt = IERC20(_usdt);
        SigmaToken = IERC20(_SigmaToken);
        poolFee = _poolFee;
    }
    // ** writeables **
    // * registeration *
    function Register(address _newUser, address _ref, uint _amount) external{
        require( exists[_newUser] != true , "User already exists");
        require( exists[_ref] == true , "User does not exists");
        usdt.transferFrom(_newUser,address(this), _amount);
        users[Id[_newUser]].purchased = _amount;
        users[Id[_newUser]].passiveDueUnclaimed = _amount*3;
        users[Id[_newUser]].lastWithdrawl = 0;
        users[Id[_newUser]].passiveDueClaimed = 0;
        if(Id[_ref] == 0){
            distance[IdToAddress[0]] = 1;
        }else if(Id[_ref] != 0){
            distance[_newUser] = distance[_ref]+1;
        }
        
        rewardPool = rewardPool+((_amount*rewardsDestribution[2])/10000);
        marketing = marketing+((_amount*rewardsDestribution[3])/10000);
        Development = Development+((_amount*rewardsDestribution[4])/10000);
        LiquidityPool = LiquidityPool+((_amount*rewardsDestribution[4])/10000);
        silver(_newUser, _ref,_amount,false);
    }
    function Upgrade(address _newUser, uint _amount, uint _currency) external{
        require( exists[_newUser] == true , "User already exists");
        // require( exists[_ref] == true , "User does not exists");
        if(_currency == 1){
            usdt.transferFrom(_newUser,address(this), _amount);
        }else if (_currency = 2){
            SigmaToken.transferFrom(_newUser,address(this), _amount);
        }
        users[Id[_newUser]].purchased = _amount;
        users[Id[_newUser]].passiveDueUnclaimed = _amount*3;
        users[Id[_newUser]].lastWithdrawl = 0;
        users[Id[_newUser]].passiveDueClaimed = 0;
        rewardPool = rewardPool+((_amount*rewardsDestribution[2])/10000);
        marketing = marketing+((_amount*rewardsDestribution[3])/10000);
        Development = Development+((_amount*rewardsDestribution[4])/10000);
        // LiquidityPool = LiquidityPool+((_amount*rewardsDestribution[4])/10000);
        silver(_newUser, _ref,_amount,false);
    }
    function FunctionalRegistration(address _newUser, address _ref, bool _free) public{
        require( exists[_newUser] != true  , "User already exists");
        require( exists[_ref] == true  , "User does not exists");
        require(TierMaster[_ref] == true ,"Tiermaster can run this function ");
        silver(_newUser, _ref,0,_free);
    }
    function emergencyWithdraw() public{
        require(msg.sender == IdToAddress[0], "Only Owner an run this function" );
        uint bal = usdt.balanceOf(address(this));
        uint bal2 = SigmaToken.balanceOf(address(this));
        usdt.transfer(msg.sender,bal);
        SigmaToken.transfer(msg.sender,bal2);
    }

    function ClaimReward(address _user) external returns (uint, uint) {
        require( exists[_user] == true  , "User doesnt exists");
        // uint lastTime = users[Id[_user]].lastWithdrawl;
        uint newTime = block.timestamp - users[Id[_user]].lastWithdrawl;
        uint sigmaTokenAmount;
        if(newTime >= 2592000){
            if(newTime > 2592000){
                uint difference = newTime-2592000; 
                users[Id[_user]].lastWithdrawl = (block.timestamp)-difference;
            }
            sigmaTokenAmount = users[Id[_newUser]].passiveDueUnclaimed/12;
            users[Id[_newUser]].passiveDueClaimed = users[Id[_newUser]].passiveDueClaimed + sigmaTokenAmount;
            rewardPool = rewardPool - sigmaTokenAmount;
        }
        // uint usdtAmount = (users[Id[_user]].purchased*2500)/10000;
        // usdt.transfer(to, usdtAmount);
        if(users[Id[_newUser]].passiveDueClaimed < users[Id[_newUser]].passiveDueUnclaimed){
            SigmaToken.transfer(_user, sigmaTokenAmount);
        }else if(users[Id[_newUser]].passiveDueClaimed == users[Id[_newUser]].passiveDueUnclaimed){
            users[Id[_newUser]].passiveDueClaimed = 0;
            users[Id[_newUser]].passiveDueUnclaimed = 0;
            users[Id[_newUser]].purchased = 0;
            users[Id[_newUser]].lastWithdrawl = 0;
        }
    }

    // ** Internal functions **   
    function silver(address _user, address _ref, uint _amount , bool _free) internal{
        exists[_user] = true;
        Id[_user] = currentId;
        IdToAddress[currentId] = _user;
        users[currentId].DRef = Id[_ref];
        if(users[Id[_ref]].counter < 1 ){
            users[Id[_ref]].counter = 1;
            team[_ref][users[Id[_ref]].counter].push(Id[_user]);
        }else if(users[Id[_ref]].counter >= 1 ){
            if(arrayAllEqual(team[_ref][users[Id[_ref]].counter], 15)){
                users[Id[_ref]].counter = users[Id[_ref]].counter+1;
                team[_ref][users[Id[_ref]].counter].push(Id[_user]);
            }else if(isArraySumLessThan(team[_ref][users[Id[_ref]].counter], 15)) {
                team[_ref][users[Id[_ref]].counter].push(Id[_user]);
            }
        }
        // team[_ref][users[Id[_ref]].counter] = currentId;
        users[currentId].started = block.timestamp;
        currentId++;
        if(_free != true){
            UpLineDistribution(_user,_amount);
        }        
        emit NewUser(Id[_user],Id[_ref],block.timestamp);
    }
    function UpLineDistribution(address _user, uint _amount) internal {
        uint _ref = users[Id[_user]].DRef;
        uint loopLength = distance[IdToAddress[_ref]];
        uint totalUplineReward = (_amount*rewardsDestribution[1])/10000;
        if(loopLength == 0){
            users[_ref].RefUnclaimedRewards = users[_ref].RefUnclaimedRewards + (totalUplineReward) ; 
        }else if(loopLength == 1){
            uint totalRewardAmount = totalUplineReward-(totalUplineReward*uplineRewardDistribution[1])/10000;
            users[_ref].RefUnclaimedRewards = users[_ref].RefUnclaimedRewards + (totalUplineReward*uplineRewardDistribution[1])/10000;
            users[0].RefUnclaimedRewards = users[0].RefUnclaimedRewards + totalRewardAmount;
        }else{
            uint _refU = distance[IdToAddress[_ref]];
            for (uint256 i = 1; i < loopLength; i++) {
                uint reward = (totalUplineReward * uplineRewardDistribution[i])/10000;
                if(_refU != 1 || _refU != 0){
                    users[_refU].RefUnclaimedRewards = users[_ref].RefUnclaimedRewards+reward; 
                    _refU = distance[IdToAddress[users[_refU].DRef]];
                }else if(_refU == 1 || _refU == 0){
                    if(_refU == 1){
                        users[_refU].RefUnclaimedRewards = users[_ref].RefUnclaimedRewards+reward;
                    }else if(_refU == 0){
                        users[_refU].RefUnclaimedRewards = users[_ref].RefUnclaimedRewards+reward;
                    }
                }
            }
        }
    }

    // ** readables **

    function user(address _user) public view returns(uint,uint,uint,uint){
        return 
            (users[Id[_user]].DRef, 
            users[Id[_user]].purchased, 
            users[Id[_user]].earnedRewards,
            users[Id[_user]].started
            );
    }
    function userDetails(address _user) public view returns(uint,uint,uint,uint){
        return (
                users[Id[_user]].RefUnclaimedRewards,
                users[Id[_user]].passiveLastClaimed, 
                Id[_user], 
                users[Id[_user]].counter);
    }
    function teamlist(address _user, uint _listNumber) public view returns(uint[] memory){
        return team[_user][_listNumber];
    }
    function claimedRewards(address _user) public view returns(uint, uint){
        return ( users[Id[_user]].earnedRewards ,PassiveClaimed[_user]);
    }
    function isUserExists(address _user) public view returns(bool){
        return exists[_user];
    }
    function IdtoAddress(uint _id) public view returns(address ){
        return IdToAddress[_id];
    }

    function LastIdUser()public view returns(uint, uint){
        return (currentId,TotalEarningOfAllUsers);
    } 
    // function buyLevelPrice() public view returns(uint[] memory){
    //     return fee;
    // }
    function arrayAllEqual(uint256[] memory arr, uint256 val) internal pure returns (bool) {
        for (uint i = 0; i < arr.length; i++) {
            if (arr[i] != val) {
                return false;
            }
        }
        return true;
    }
    function isArraySumLessThan(uint256[] memory arr, uint256 threshold) public pure returns (bool) {
        uint256 sum = 0;
        for (uint256 i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum < threshold;
    }
}