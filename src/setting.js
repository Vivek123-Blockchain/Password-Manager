import { useEffect, useState } from "react";
import "./App.css";
import { useHistory, Link } from "react-router-dom";
import Web3 from "web3";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import swal from "sweetalert";

var abi = require("./abi/password_generator.json");

function App() {
  const [userAccount, setuserAccount] = useState("");
  const [netWorkId, setNetWorkId] = useState(null);
  const [password, setPassword] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [data, setData] = useState([]);
  const [clkd, setClkd] = useState(null);

  useEffect(async () => {
    if (typeof window.ethereum !== "undefined" || typeof window.web3 !== "undefined") {
      const web3 = new Web3(window.web3.currentProvider);

      const metaMaskNetwork = await web3.eth.net.getId();
      setNetWorkId(metaMaskNetwork);

      const userWalletAddressArray = await web3.eth.getAccounts();
      const userWalletAddress = userWalletAddressArray[0];
      setuserAccount(userWalletAddress);

      window.ethereum.on("accountsChanged", async function (accounts) {
        setuserAccount(accounts[0]);
      });
      window.ethereum.on("networkChanged", function (network) {
        setNetWorkId(network);
      });
    } else {
      swal("Oops!", "please install metamask", "error");
      return;
    }
  }, []);

  useEffect(async () => {
    // fetch all passwords from contract ...
    if (
      typeof window.ethereum !== "undefined" ||
      typeof window.web3 !== "undefined"
    ) {
      const web3 = new Web3(window.web3.currentProvider);
      const contract = new web3.eth.Contract(
        abi,
        process.env.REACT_APP_CONTRACT_ADDRESS
      );

      try {
        const getData = await contract.methods
          .get_pass()
          .call({ from: userAccount });
        setData(getData);
      } catch (e) {
      }
    }
  }, [userAccount]);


  async function switchNet() {
    if ((typeof window.ethereum !== "undefined" || typeof window.web3 !== "undefined") && netWorkId !== 111) {
      try {
        const ETHERLITE_MAINNET_PARAMS = {
          chainId: '0x6F', // A 0x-prefixed hexadecimal chainId
          chainName: 'EtherLite Main Network',
          nativeCurrency: {
            name: 'EtherLite',
            symbol: 'ETL',
            decimals: 18
          },
          rpcUrls: ['https://rpc.etherlite.org/'],
          blockExplorerUrls: ['https://explorer.etherlite.org/']
        }

        const wasAdded = await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [ETHERLITE_MAINNET_PARAMS]
        })
        const web3 = new Web3(window.web3.currentProvider);
        const contract = new web3.eth.Contract(
          abi,
          process.env.REACT_APP_CONTRACT_ADDRESS
        );

        try {
          const getData = await contract.methods
            .get_pass()
            .call({ from: userAccount });
          setData(getData);
        } catch (e) {
        }
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            const ETHERLITE_MAINNET_PARAMS = {
              chainId: '0x6F', // A 0x-prefixed hexadecimal chainId
              chainName: 'EtherLite Main Network',
              nativeCurrency: {
                name: 'EtherLite',
                symbol: 'ETL',
                decimals: 18
              },
              rpcUrls: ['https://rpc.etherlite.org/'],
              blockExplorerUrls: ['https://explorer.etherlite.org/']
            }

            const wasAdded = await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [ETHERLITE_MAINNET_PARAMS]
            })
            const web3 = new Web3(window.web3.currentProvider);
            const contract = new web3.eth.Contract(
              abi,
              process.env.REACT_APP_CONTRACT_ADDRESS
            );
            try {
              const getData = await contract.methods
                .get_pass()
                .call({ from: userAccount });
              setData(getData);
            } catch (e) {
            }
          } catch (addError) {
            // handle "add" error
          }
        }
        // handle other "switch" errors
      }
    }
  }

  const handleConnect = async () => {

    if (window.ethereum) {
      const web3 = new Web3(window.web3.currentProvider);
      try {
        window.ethereum.enable().then(function () {
        });
      } catch (e) {
      }
    } else if (window.web3) {
      const web3 = new Web3(window.web3.currentProvider);
    } else {
      swal("Oops!", "Please install MetaMask", "error");
    }
  };

  return (
    <div className="App">
      <nav className="navbar navbar-light bg-light d-lg-block d-none">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img src="assets/img/logo/logo.png" />
          </a>
          <form className="d-flex">
            {
              userAccount ?
                (<button type="button" className="btn d-block bg_btn btn_bg erc_btn w-100 text-center">{userAccount}</button>)
                : (<button type="button" className="btn d-block bg_btn btn_bg erc_btn w-100 text-center" onClick={handleConnect}>Connect You Wallet</button>)
            }
          </form>
        </div>
      </nav>
      <div className="login_form">
        <div className="row">
          <div className={"col-lg-6 pe-lg-0 order-2 order-lg-1"}>
            {netWorkId != 111 ? (
              <div className="form_erc erc_singup tetxt-strat justify-content-center">
                <button
                  onClick={() => switchNet()}
                  class="btn bg_btn erc_btn w-50"
                >
                  Switch Network
                </button>
              </div>
            ) : (
              <div>
                <div className="form_erc">
                  <div className="erc_singup tetxt-strat">
                    <div className="login_title d-flex justify-content-between align-items-center mb-3">
                      <h1>Setting Manager</h1>
                      <Link to="/password">
                        <button type="button" class="btn add_btn">
                          Add
                        </button>
                      </Link>
                    </div>

                    <div className="login_body table_height text-start position-relative">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <td className="form-label font_13">Website</td>
                            <td className="form-label font_13">Username</td>
                            <td className="form-label font_13">Password</td>
                          </tr>
                        </thead>
                        {data.map((item, index) => {
                          return (
                            <tbody>
                              <tr>
                                <td>
                                  {item[2]}
                                </td>
                                <td className="form-label">{item[0]}</td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <input
                                      type={
                                        isPasswordShown && index == clkd
                                          ? "text"
                                          : "password"
                                      }
                                      className="form-control bg-transparent border-0"
                                      id="exampleFormControlInput1"
                                      value={item[1]}
                                      onChange={(e) =>
                                        setPassword(e.target.value)
                                      }
                                      disabled
                                    />
                                    {isPasswordShown && index == clkd ? (
                                      <VisibilityIcon
                                        onClick={() => {
                                          setClkd(index);
                                          setIsPasswordShown(!isPasswordShown);
                                        }}
                                      />
                                    ) : (
                                      <VisibilityOffIcon
                                        onClick={() => {
                                          setClkd(index);
                                          setIsPasswordShown(!isPasswordShown);
                                        }}
                                      />
                                    )}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          );
                        })}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={"col-lg-6 ps-lg-0 order-1 order-lg-2"}>
            <nav className="navbar navbar-expand-lg d-lg-none d-block">
              <div className="container-fluid">
                <div className="d-flex">
                <a className="navbar-brand" href="#">
                  <img src="assets/img/logo/logo.png" />
                </a>
                <form className="d-flex">
                  {
                    userAccount ?
                      (<button type="button" className="btn d-block bg_btn btn_bg erc_btn overflow-hidden text-center">{userAccount}</button>)
                      : (<button type="button" className="btn d-block bg_btn btn_bg erc_btn text-center overflow-hidden" onClick={handleConnect}>Connect You Wallet</button>)
                  }
                </form>
                </div>
              </div>
            </nav>
            <div className="erc_section">
              <img
                src="assets/img/Mask_Group_desktop.png"
                className="d-lg-block d-none"
              />
              <img
                src="assets/img/Mask_Group_mobile.png"
                className="d-lg-none d-block"
              />
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered  ">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="heading-stalk mb-0 text-center justify-content-between align-Items-center">
                  Connect Your Wallet
                </h6>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex justify-content-between align-Items-center meta_field">
                  <div className="meta_title">Wallet Connect</div>
                  <div>
                    <img src="assets/img/wallet.png" className="meta_logo" />
                  </div>
                </div>
                <br />
                <div className="d-flex justify-content-between align-Items-center meta_field">
                  <div className="meta_title">MetaMask Connect </div>
                  <div>
                    <img src="assets/img/meta.png" className="meta_logo" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
