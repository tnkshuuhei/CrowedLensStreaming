// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {ISuperfluid, ISuperToken, ISuperApp} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";

error Unauthorized();

contract LensStreaming {
    using SuperTokenV1Library for ISuperToken;
    /// @notice Allow list.
    mapping(address => bool) public accountList;
    mapping(uint256 => Project) public projects;
    uint256 public numberOfProjects = 0;

		struct Project {
        address owner; // who created this stream or recipient of the stream
				address recipient; // recipient of the stream
        string title; // title of the crowdfunding
        string description; // description of the crowdfunding
        uint256 target; // target amount of the crowdfunding
        uint256 deadline; // deadline of crowdfunding
        uint256 amountCollected; // amount collected so far
		    uint256 amountWithdrawn; // amount withdrawn so far
        string image; // image of the crowdfunding
        address[] donators; // list of donators
        uint256[] donations; // list of donations
    }

    /// @notice Send a lump sum of super tokens into the contract.
    /// @dev This requires a super token ERC20 approval.
    /// @param token Super Token to transfer.
    /// @param amount Amount to transfer.
    function sendLumpSumToContract(ISuperToken token, uint256 amount) external {
        // if (!accountList[msg.sender] && msg.sender != project.owner) revert Unauthorized();
        token.transferFrom(msg.sender, address(this), amount);
    }

		function createProject(
				address _owner,
				address _recipient, 
				string memory _title, 
				string memory _description, 
				uint256 _target, 
				uint256 _deadline, 
				string memory _image) 
			public returns (uint256) {
        Project storage project = projects[numberOfProjects];
        require(project.deadline < block.timestamp, "The deadline should be a date in the future.");
        project.owner = _owner;
				project.recipient = _recipient;
        project.title = _title;
        project.description = _description;
        project.target = _target;
        project.deadline = _deadline;
        project.amountCollected = 0;
				project.amountWithdrawn = 0;
        project.image = _image;
        numberOfProjects++;
				project.owner = _recipient; //change project owner to recipient address
				// if (project.recipient != owner) revert Unauthorized(
				// );
        return numberOfProjects - 1;
		}


	  /// @notice Create a stream into the contract.
    /// @dev This requires the contract to be a flowOperator for the msg sender.
    /// @param token Token to stream.
    /// @param flowRate Flow rate per second to stream.
    function createFlowIntoContract(uint256 _id, ISuperToken token, int96 flowRate, uint256 montylyRate) external payable {
        // if (!accountList[msg.sender] && msg.sender != owner) revert Unauthorized();

        uint256 amount = montylyRate;

        Project storage project = projects[_id];

        project.donators.push(msg.sender);
        project.donations.push(amount);

        (bool sent) = token.createFlowFrom(msg.sender, address(this), flowRate);

        if(sent) {
            project.amountCollected = project.amountCollected + amount;
        }
        
    }
    /// @notice Create flow from contract to specified address.
    /// @param token Token to stream.
    /// @param receiver Receiver of stream.
    /// @param flowRate Flow rate per second to stream.
    function createFlowFromContract(
        ISuperToken token,
        address receiver,
        int96 flowRate
    ) external {
        // if (!accountList[msg.sender] && msg.sender != owner) revert Unauthorized();
        token.createFlow(receiver, flowRate);
    }
		
    /// @notice Delete a stream that the msg.sender has open into the contract.
    /// @param token Token to quit streaming.
    function deleteFlowIntoContract(ISuperToken token) external {
        // if (!accountList[msg.sender] && msg.sender != owner) revert Unauthorized();

        token.deleteFlow(msg.sender, address(this));
    }

    /// @notice Withdraw funds from the contract.
    /// @param _id  Id of the project.
    /// @param amount Amount to withdraw.
		function withdrawFunds(uint256 _id, uint256 amount) external {
				require(msg.sender == projects[_id].owner, "Only the owner can withdraw funds");
				if (msg.sender != projects[_id].recipient) revert Unauthorized();
				require(amount <= projects[_id].amountCollected - projects[_id].amountWithdrawn, "Insufficient balance");

				projects[_id].amountWithdrawn += amount;
				payable(msg.sender).transfer(amount);
		}
    /// @notice Update flow from contract to specified address.
    /// @param token Token to stream.
    /// @param receiver Receiver of stream.
    /// @param flowRate Flow rate per second to stream.
    function updateFlowFromContract(
        ISuperToken token,
        address receiver,
        int96 flowRate
    ) external {
        // if (!accountList[msg.sender] && msg.sender != owner) revert Unauthorized();

        token.updateFlow(receiver, flowRate);
    }
    /// @notice Delete flow from contract to specified address.
    /// @param token Token to stop streaming.
    /// @param receiver Receiver of stream.
    function deleteFlowFromContract(ISuperToken token, address receiver) external {
        // if (!accountList[msg.sender] && msg.sender != owner) revert Unauthorized();

        token.deleteFlow(address(this), receiver);
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (projects[_id].donators, projects[_id].donations);
    }

    function getProjects() public view returns (Project[] memory) {
        Project[] memory allProjects = new Project[](numberOfProjects);

        for(uint i = 0; i < numberOfProjects; i++) {
            Project storage item = projects[i];

            allProjects[i] = item;
        }

        return allProjects;
    }


}