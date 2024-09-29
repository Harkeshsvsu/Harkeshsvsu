const contractAddress = "0x9d8a44c405bcb3205e98916925e129ea6823411e";
const contractABI = [
    {
        "inputs": [{ "internalType": "uint256", "name": "_bags", "type": "uint256" }],
        "name": "claimFertilizer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "retailer", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "bags", "type": "uint256" }
        ],
        "name": "FertilizerClaimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "retailer", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "bags", "type": "uint256" }
        ],
        "name": "FertilizerReleased",
        "type": "event"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "_retailer", "type": "address" },
            { "internalType": "string", "name": "_name", "type": "string" }
        ],
        "name": "registerRetailer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "_retailer", "type": "address" },
            { "internalType": "uint256", "name": "_bags", "type": "uint256" }
        ],
        "name": "releaseFertilizer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "government",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "isRetailer",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "retailers",
        "outputs": [
            { "internalType": "string", "name": "name", "type": "string" },
            { "internalType": "uint256", "name": "bagsAllocated", "type": "uint256" },
            { "internalType": "uint256", "name": "bagsClaimed", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "_retailer", "type": "address" }],
        "name": "viewDistribution",
        "outputs": [
            { "internalType": "string", "name": "", "type": "string" },
            { "internalType": "uint256", "name": "", "type": "uint256" },
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let contract;

window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            console.log("Connected accounts:", accounts);
            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Contract initialized:", contract);
        } catch (error) {
            console.error("Account access denied:", error);
        }
    } else {
        alert('Please install MetaMask to use this application!');
    }

    // Register Retailer
    document.getElementById('registerForm').onsubmit = async (event) => {
        event.preventDefault();
        const retailerAddress = document.getElementById('retailerAddress').value;
        const retailerName = document.getElementById('retailerName').value;
        const accounts = await web3.eth.getAccounts();

        if (!web3.utils.isAddress(retailerAddress)) {
            alert('Invalid retailer address');
            return;
        }

        try {
            await contract.methods.registerRetailer(retailerAddress, retailerName)
                .send({ from: accounts[0] });
            alert('Retailer registered successfully!');
        } catch (error) {
            console.error('Error registering retailer:', error.message);
            alert('Error registering retailer: ' + error.message);
        }
    };

    // Release Fertilizer
    document.getElementById('releaseForm').onsubmit = async (event) => {
        event.preventDefault();
        const releaseAddress = document.getElementById('releaseAddress').value;
        const bagsToRelease = document.getElementById('bagsToRelease').value;
        const accounts = await web3.eth.getAccounts();

        if (!web3.utils.isAddress(releaseAddress)) {
            alert('Invalid retailer address');
            return;
        }

        if (isNaN(bagsToRelease) || bagsToRelease <= 0) {
            alert('Invalid number of bags');
            return;
        }

        try {
            await contract.methods.releaseFertilizer(releaseAddress, bagsToRelease)
                .send({ from: accounts[0] });
            alert('Fertilizer released successfully!');
        } catch (error) {
            console.error('Error releasing fertilizer:', error.message);
            alert('Error releasing fertilizer: ' + error.message);
        }
    };

    // Claim Fertilizer
    document.getElementById('claimForm').onsubmit = async (event) => {
        event.preventDefault();
        const bagsToClaim = document.getElementById('bagsToClaim').value;
        const accounts = await web3.eth.getAccounts();

        if (isNaN(bagsToClaim) || bagsToClaim <= 0) {
            alert('Invalid number of bags to claim');
            return;
        }

        try {
            await contract.methods.claimFertilizer(bagsToClaim)
                .send({ from: accounts[0] });
            alert('Fertilizer claimed successfully!');
        } catch (error) {
            console.error('Error claiming fertilizer:', error.message);
            alert('Error claiming fertilizer: ' + error.message);
        }
    };

    // View Distribution
    document.getElementById('viewForm').onsubmit = async (event) => {
        event.preventDefault();
        const viewAddress = document.getElementById('viewAddress').value;

        if (!web3.utils.isAddress(viewAddress)) {
            alert('Invalid retailer address');
            return;
        }

        try {
            const result = await contract.methods.viewDistribution(viewAddress).call();
            document.getElementById('distributionResult').innerHTML = 
                `<strong>Name:</strong> ${result[0]}<br>
                <strong>Bags Allocated:</strong> ${result[1]}<br>
                <strong>Bags Claimed:</strong> ${result[2]}`;
        } catch (error) {
            console.error('Error viewing distribution:', error.message);
            alert('Error viewing distribution: ' + error.message);
        }
    };
});
