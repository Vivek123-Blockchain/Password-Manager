import { useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import swal from "sweetalert";
import Loader from "react-js-loader";
import { useHistory, Link } from "react-router-dom";

var abi = require("./abi/password_generator.json");

function App() {
  const [claimbtn, setClaim] = useState(true);

  const [accountType, setAccountType] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [description, setdescription] = useState("");
  const [userAccount, setuserAccount] = useState("");
  const [netWorkId, setNetWorkId] = useState(null);
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (
      typeof window.ethereum !== "undefined" ||
      typeof window.web3 !== "undefined"
    ) {
      setTx(null);
      const web3 = new Web3(window.web3.currentProvider);

      const metaMaskNetwork = await web3.eth.net.getId();
      setNetWorkId(metaMaskNetwork);

      const userWalletAddressArray = await web3.eth.getAccounts();
      const userWalletAddress = userWalletAddressArray[0];
      setuserAccount(userWalletAddress);
      // getUserData();

      window.ethereum.on("accountsChanged", async function (accounts) {
        setuserAccount(accounts[0]);
      });
      window.ethereum.on("networkChanged", function (network) {
        setNetWorkId(network);
      });
    } else {
      swal("Oops!", "please install metamask", "error");
    }
  }, []);

  const save = async () => {
    const web3 = new Web3(window.web3.currentProvider);
    const userWalletAddressArray = await web3.eth.getAccounts();

    if (userWalletAddressArray.length == 0) {
      swal("Oops!", "User is not logged in to MetaMask", "error");
      return;
    }

    if (typeof window.ethereum !== "undefined" || typeof window.web3 !== "undefined") {

      if (accountType == '' || accountType == undefined || accountType == null) {
        swal("Oops!", "Please enter account id", "error");
        return
      }

      if (password == '' || password == undefined || password == null) {
        swal("Oops!", "Please enter password", "error");
        return
      }

      if (description == '' || description == undefined || description == null) {
        swal("Oops!", "Please enter website url", "error");
        return
      }
      setClaim(false);
      setLoading(true);
      const web3 = new Web3(window.web3.currentProvider);
      const contract = new web3.eth.Contract(
        abi,
        process.env.REACT_APP_CONTRACT_ADDRESS
      );
      contract.methods
        .save(accountType, password, description)
        .send({ from: userAccount })
        .then((tx) => {
          setPassword('');
          setAccountType('');
          setdescription('');
          setTx(tx);
          setLoading(false);
          setClaim(true)

        })
        .catch((err) => {
          setPassword('');
          setAccountType('');
          setdescription('');
          setLoading(false);
          setClaim(true)
          swal("Oops!", err.message, "error");
        });
    } else {
      swal("Oops!", "please install metamask", "error");
    }
  };

  useEffect(() => {
    if (tx !== null) {
      swal("Good job!", "Password Saved!", "success");
    }
  }, [tx]);

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

  const switchNet = async () => {
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
      } catch (switchError) {
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
          } catch (addError) {
          }
        }
      }
    }
  }

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

            {/* <button className="btn sign_btn" type="submit">
              {userAccount ? userAccount : "Connect Wallet"}
            </button> */}
          </form>
        </div>
      </nav>
      <div className="login_form">
        <div className="row">
          <div className={"col-lg-6 pe-lg-0 order-2 order-lg-1"}>
            <div className="">
              <div className="form_erc">
                <div className="erc_singup tetxt-strat">
                  <div className="login_title">
                    <h1>Password Manager</h1>
                    <Link to="/">
                      <button type="button" class="btn add_btn">
                        List
                      </button>
                    </Link>
                    {/* <p>
                      lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                      sed diam nonumy eirmod te,por invidunt ut labore et
                      dolore.
                    </p> */}
                  </div>
                  <div className="login_body text-start">
                    <div className="form_title text-center">
                      <p>fill up the information</p>
                    </div>
                    <div className="mb-4 position-relative">
                      <label
                        htmlFor="exampleFormControlInput1"
                        className="form-label font_12"
                      >
                        Account ID
                      </label>
                      <input
                        type="text"
                        className="form-control input_padding"
                        id="exampleFormControlInput1"
                        placeholder="abcde@gmail.com"
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                      />
                      <div className="icon_form">
                        <img src="assets/img/icon/email.svg" />
                      </div>
                    </div>
                    <div className="mb-4 position-relative">
                      <label
                        htmlFor="exampleFormControlInput1"
                        className="form-label font_12"
                      >
                        Password
                      </label>
                      <input
                        type={isPasswordShown ? "text" : "password"}
                        className="form-control input_padding"
                        id="exampleFormControlInput1"
                        placeholder="*****"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <div className="icon_form">
                        <img src="assets/img/icon/lock.svg" />
                      </div>
                      <div className="icon_ice">
                        {isPasswordShown ? (
                          <VisibilityIcon
                            onClick={() => setIsPasswordShown(!isPasswordShown)}
                          />
                        ) : (
                          <VisibilityOffIcon
                            onClick={() => setIsPasswordShown(!isPasswordShown)}
                          />
                        )}
                      </div>
                    </div>
                    <div className="mb-4 position-relative">
                      <label
                        htmlFor="exampleFormControlInput1"
                        className="form-label font_12"
                      >
                        Description
                      </label>
                      <textarea
                        type="text"
                        className="form-control input_padding   "
                        id="exampleFormControlInput1"
                        placeholder="gmail.com"
                        onChange={(e) => setdescription(e.target.value)}
                      />
                      <div className="icon_form">
                        <img src="assets/img/icon/copy.svg" />
                      </div>
                    </div>
                    {
                      netWorkId == 111 ?
                        (<button disabled={!claimbtn} type="button"
                          className="btn d-block bg_btn erc_btn w-100 text-center"
                          onClick={save}>
                          {loading && (
                            <Loader
                              type="spinner-default"
                              bgColor={"#FFFFFF"}
                              size={25}
                            />
                          )}
                          {!loading && "Submit"}
                        </button>)
                        : (<button type="button" className="btn d-block bg_btn erc_btn w-100 text-center" onClick={switchNet}>Please use EtherLite Main Network</button>)
                    }


                    {/* <button disabled={!claimbtn}
                      type="button"
                      class="btn d-block bg_btn erc_btn w-100 text-center"
                      onClick={() => save()}
                    >
                      {loading && (
                        <Loader
                          type="spinner-default"
                          bgColor={"#FFFFFF"}
                          size={25}
                        />
                      )}
                      {!loading && "Submit"}
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={"col-lg-6 ps-lg-0 order-1 order-lg-2"}>
            <nav className="navbar navbar-expand-lg d-lg-none d-block">
              <div className="container-fluid">
              <a className="navbar-brand" href="xyzb">
              <img src="assets/img/logo/logo.png" />
              </a>
              <form className="d-flex">
            {
              userAccount?
              (<button type ="button" className="btn d-block bg_btn btn_bg erc_btn w-100 text-center">{userAccount}</button>)
              : (<button type ="button" className="btn d-block bg_btn btn_bg erc_btn w-100 text-center" onClick={handleConnect}>Connect You Wallet</button>)
            }
              </form>
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
      </div>
    </div>
  );
}

export default App;
