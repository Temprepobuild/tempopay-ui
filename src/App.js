import { useEffect, useState } from "react";
import { ethers } from "ethers";

const TEMPOPAY_ADDRESS = "0x82F017b13E73D122Da1EB148FA3007ad2d6e7C47";
const TEMPOPAY_ABI = [
  "function deposit(uint256 amount)",
  "function sendPayment(address to, uint256 amount, string memo)",
  "function withdraw(uint256 amount)",
  "function stablecoin() view returns (address)",
];

export default function TempoPayUI() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");

  const [depositAmount, setDepositAmount] = useState("");
  const [to, setTo] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [memo, setMemo] = useState("");

  async function connectWallet() {
    if (!window.ethereum) return alert("Install MetaMask");
    const prov = new ethers.BrowserProvider(window.ethereum);
    await prov.send("eth_requestAccounts", []);
    const sign = await prov.getSigner();
    const acc = await sign.getAddress();
    const cont = new ethers.Contract(TEMPOPAY_ADDRESS, TEMPOPAY_ABI, sign);

    setProvider(prov);
    setSigner(sign);
    setAccount(acc);
    setContract(cont);
  }

  async function deposit() {
    const tx = await contract.deposit(ethers.parseUnits(depositAmount, 6));
    await tx.wait();
    alert("Deposit Successful");
  }

  async function sendPayment() {
    const tx = await contract.sendPayment(
      to,
      ethers.parseUnits(sendAmount, 6),
      memo
    );
    await tx.wait();
    alert("Payment Sent");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-xl w-96 space-y-4">
        <h1 className="text-xl font-bold text-center">TempoPay Testnet UI</h1>

        {!account && (
          <button
            onClick={connectWallet}
            className="w-full bg-blue-500 p-2 rounded"
          >
            Connect Wallet
          </button>
        )}

        {account && (
          <p className="text-sm break-all">Connected: {account}</p>
        )}

        <div className="border-t border-gray-600 pt-4">
          <h2 className="font-semibold">Deposit</h2>
          <input
            placeholder="Amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full p-2 text-black"
          />
          <button onClick={deposit} className="w-full bg-green-500 p-2 mt-2">
            Deposit
          </button>
        </div>

        <div className="border-t border-gray-600 pt-4">
          <h2 className="font-semibold">Send Payment</h2>
          <input
            placeholder="To Address"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full p-2 text-black"
          />
          <input
            placeholder="Amount"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            className="w-full p-2 mt-1 text-black"
          />
          <input
            placeholder="Memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full p-2 mt-1 text-black"
          />
          <button onClick={sendPayment} className="w-full bg-purple-500 p-2 mt-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
