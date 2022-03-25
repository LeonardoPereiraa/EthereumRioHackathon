import React, { useState, useEffect} from 'react'
import { ethers, BigNumber } from 'ethers';
import abi from '../blockchain/abi.json';
import CONFIG from '../blockchain/config';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import * as s from "../styles/globalStyles";
import * as n from './NavElements';
import {
    StyledButton,
    StyledRoundButton,
    ResponsiveWrapper,
    StyledLogo,
    StyledImg,
    StyledLink
} from "../styles/geral";


const truncate = (input, len, len2) =>
  input.length > len? `${input.substring(0, len)}...${input.substring(38, len2)}` :
  input;



const NavMint = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [idtoken, setIdtoken] = useState();
    const [mintado, setMintado] = useState(false);
    const [claimingNft, setClaimingNft] = useState(false);
    const [claimed, setClaimed] = useState()
    const [feedback, setFeedback] = useState(`Click buy to mint your NFT!`)
    const [mintAmount, setMintAmount] = useState(1);
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen)
    }

    /* START METAMASK CONNECTION */

    const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;
        if(!ethereum) {
            console.log("Make sure you have metamask install!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }
    
        const accounts = await ethereum.request({ method: 'eth_accounts' });
    
        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Authorized account: ", account);
            setCurrentAccount(account);
            setupEventListener();
        } else {
            console.log("not authorized account");
        }
    }

    const connectWallet = async () => {
        try {
            const { ethereum } = window;
    
            if(!ethereum) {
            alert("Get Metamask!");
            return;
            }
    
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Connected to: ", accounts[0]);
            setCurrentAccount(accounts[0]);
            setupEventListener();
        } catch (error) {
            console.log("Connect Wallet", error);
        }
    }

    /* EVENTS */

    const setupEventListener = () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const impacto = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, abi.abi, signer);
    
            impacto.on("Transfer", (from, to, tokenId) => {
                console.log("EVENT: ", from, to, tokenId);
                let numOfTokenId = BigNumber.from(tokenId).toString();
                setIdtoken(numOfTokenId);
                console.log("Token Id :", numOfTokenId);
            });
            }
        } catch (error) {
            console.log("Event ", error);
        }
    }

    /* START CALL CONTRACT */

    const mintFunction = async () => {
        try {
            const { ethereum } = window;
    
            if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const impacto = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, abi.abi, signer);
            setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
            setClaimingNft(true);
            console.log("minting...");
    
            //let valueTransaction = CONFIG.DISPLAY_COST * mintAmount;
    
            let mintTransaction = await impacto.mint(1/* BigNumber.from(mintAmount), {value: ethers.utils.parseEther(valueTransaction.toString())} */);
            await mintTransaction.wait();
            setFeedback(`wow! the ${CONFIG.NFT_NAME} is minted! go visit Collection on Opensea.io to view it`);
            setMintado(true);
            setClaimingNft(false);
            console.log("transaction: ", mintTransaction);
            }
        } catch (error) {
            console.log("error: ", error);
            setFeedback("Sorry, something went wrong please try again later.");
            setClaimingNft(false);
        }
    }

    /* SETUP MINT AMOUNT */

    const decrementMintAmount = () => {
        let newMintAmount = mintAmount - 1;
        if(newMintAmount < 1) {
            newMintAmount = 1;
        }
        setMintAmount(newMintAmount);
    
        }
        const incrementMintAmount = () => {
        let newMintAmount = mintAmount + 1;
        if(newMintAmount > 1) {
            newMintAmount = 1;
        }
        setMintAmount(newMintAmount);
    }

    /* USE EFFECT HOOKS */
    useEffect(() => {
        checkIfWalletIsConnected();
        }, []);
    
    /* useEffect(() => {
    connectWallet();
    }, []); */

    useEffect( async () => {
        console.log("ohhhhh")
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const impacto = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, abi.abi, provider);
        console.log("ohhhhh2")
        let mintedNFT = await impacto.totalSupply();
        console.log("ohhhhh3")
        console.log(await mintedNFT.wait);
        let totalMinted = BigNumber.from(mintedNFT._hex).toString();
        console.log("Total NFT minted already:" , totalMinted);
        setClaimed(totalMinted);
        }, []);


    return (
    <>
        <Sidebar isOpen={isOpen} toggle={toggle} />
        <n.Nav>
            <n.NavbarContainer>
                <n.NavLogo to="/">Conexão Impacto</n.NavLogo>
                <n.MobileIcon onClick={toggle}>
                    <FaBars />
                </n.MobileIcon>
                <n.NavMenu>
                <n.NavItem>
                    <n.NavLinks to='about'>
                        About
                    </n.NavLinks>
                </n.NavItem>
                <n.NavItem>
                <n.NavLinks to='collection'>
                    Collection
                </n.NavLinks> 
                </n.NavItem>
                <n.NavItem>
                <n.NavLinks to='mint'>
                    Mint
                </n.NavLinks> 
                </n.NavItem>
                <n.NavItem>
                <n.NavLinks to='follow'>
                    Follow us
                </n.NavLinks> 
                </n.NavItem>
            </n.NavMenu>
            {currentAccount === "" ? (
                <>
                    <n.NavBtn  onClick={() => { connectWallet()}}><n.NavBtnLink>Connect Wallet</n.NavBtnLink>
                    </n.NavBtn>
                </>
            ) : (
                <>
                    <n.NavBtn 
                    disabled={currentAccount !== "" ? 1 : 0}
                    onClick={(e) => { e.preventDefault(); }}
                    >
                        <n.NavBtnLink>Connect to: {truncate(currentAccount, 5, 42)}</n.NavBtnLink>
                    </n.NavBtn>
                </>
            )}
            </n.NavbarContainer>
        </n.Nav>
        
        {/* mint section */}
        <s.Screen>
            <s.Container
                id="mint"
                flex={1}
                ai={"center"}
                style={{ padding: 24, backgroundColor: "var(--primary)" }}
                image={CONFIG.SHOW_BACKGROUND ? "/images/bg.png" : null}
            >
                {/* {<StyledImg alt={"example"} src={"/images/airdrop.PNG"} />} */}
                <s.SpacerSmall />
                
                <s.SpacerSmall  />
                <ResponsiveWrapper
                    flex={1} style={{ padding: 24 }} test 
                >
                    {<StyledLogo alt={"logo"} src={"/images/airdrop-02.PNG"}  /* id="mint" */ />}
                    <s.Container
                        flex={1} jc={"center"} ai={"center"}
                    ></s.Container>
                    <s.SpacerLarge />
                    <s.Container
                        flex={2}
                        jc={"center"}
                        ai={"center"}
                        style={{
                            backgroundColor: "var(--accent)",
                            padding: 24,
                            borderRadius: 24,
                            border: "4px ridge var(--secondary)",
                            boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
                        }}
                    >
                        <s.TextTitle
                            style={{
                                textAlign: "center",
                                fontSize: 50,
                                fontWeight: "bold",
                                color: "var(--accent-text)",
                            }}
                            >
                                {claimed} / {CONFIG.MAX_SUPPLY}
                            </s.TextTitle>
                            <s.TextDescription
                                style={{
                                    textAlign: "center",
                                    color: "var(--primary-text)",
                                }}
                            >
                                <StyledLink
                                    target={"_blank"} href={CONFIG.COLLECTION_LINK}
                                >
                                    See Collection on OpenSea!
                                </StyledLink>
                                <StyledLink
                                    target={"_blank"} href={CONFIG.SCAN_LINK} style={{marginLeft: 20}}
                                >
                                    Check Contract on EtherScan!
                                </StyledLink>
                            </s.TextDescription>
                            <s.SpacerSmall />
                            {Number(claimed) >= CONFIG.MAX_SUPPLY ? (
                            <>
                                <s.TextTitle
                                    style={{
                                        textAlign: "center",
                                        color: "var(--accent-text)",
                                    }}
                                >
                                    The Sale has ended.
                                </s.TextTitle>
                                <s.TextDescription
                                    style={{
                                        textAling: "center",
                                        color: "var(--accent-text)"
                                    }}
                                >
                                    You can still find {CONFIG.NFT_NAME} on
                                </s.TextDescription>
                                <s.SpacerSmall />
                                <StyledLink 
                                    target={"_blank"}
                                    href={CONFIG.COLLECTION_LINK}
                                >
                                    {CONFIG.MARKETPLACE}
                                </StyledLink>
                            </>
                        ) : (
                            <>
                                <s.TextTitle
                                    style={{
                                        textAling: "center",
                                        color: "var(--accent-text)",
                                    }}
                                >
                                    You can mint your free IMPACTO NFT here!
                                </s.TextTitle>
                                <s.SpacerXSmall />
                                <s.TextDescription
                                    style={{
                                        textAlign: "center",
                                        color: "var(--accent-text)"
                                    }}
                                >
                                    Excluding gas fees.
                                </s.TextDescription>
                                <s.SpacerXSmall />
                                {currentAccount === "" ? (
                                    <s.Container
                                        ai={"center"}
                                        jc={"center"}
                                    >
                                        <s.TextDescription
                                            style={{
                                                textAlign: "center",
                                                color: "var(--accent-text)",
                                            }}
                                        >
                                            Connect to the {CONFIG.NETWORK.NAME} network
                                        </s.TextDescription>
                                        <s.SpacerSmall />
                                        <StyledButton
                                            style={{width: 132}}
                                            onClick={() => {connectWallet()}}
                                        >
                                            Connect Wallet
                                        </StyledButton>
                                        {currentAccount !== "" ? (
                                            <>
                                                <s.SpacerSmall />
                                                <s.TextDescription
                                                    style={{
                                                        textAlign: "center",
                                                        color: "var(--accent-text)",
                                                    }}
                                                >
                                                    Error Connecting to Metamask.
                                                </s.TextDescription>
                                            </>
                                        ): null}
                                    </s.Container>
                                ) : (
                                    <>
                                        <s.TextDescription
                                            style={{
                                                textAlign: "center",
                                                color: "var(--accent-text)",
                                            }}
                                        >
                                            {feedback}
                                            <s.SpacerSmall />
                                            {mintado ? (
                                                <>
                                                    <StyledLink
                                                        target={"_blank"}
                                                        href={CONFIG.MARKETPLACE_LINK+idtoken}
                                                    >
                                                        Veja seu NFT na OpenSea!
                                                    </StyledLink>
                                                </>
                                            ) : null}
                                        </s.TextDescription>
                                        <s.SpacerMedium />
                                        <s.Container
                                            ai={"center"}
                                            jc={"center"}
                                            fd={"row"}
                                        >
                                            <StyledButton
                                                style={{
                                                    lineHeight: 0.4,
                                                    width: 30,
                                                    fontSize: 14
                                                }}
                                                disabled={claimingNft ? 1 : 0}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    decrementMintAmount();
                                                }}
                                            >
                                                -
                                            </StyledButton>
                                            <s.SpacerSmall />
                                            <s.TextDescription />
                                            <s.TextDescription
                                                style={{
                                                    textAlign: "center",
                                                    color: "var(--accent-text)",
                                                }}
                                            >
                                                {mintAmount}
                                            </s.TextDescription>
                                            <s.SpacerMedium />
                                            <StyledButton
                                                style={{
                                                    lineHeight: 0.4,
                                                    width: 30,
                                                    fontSize: 14
                                                }}
                                                disabled={claimingNft ? 1 : 0}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    incrementMintAmount();
                                                }}
                                            >
                                                +
                                            </StyledButton>
                                        </s.Container>
                                        <s.SpacerSmall />
                                        <s.Container
                                            i={"center"}
                                            jc={"center"}
                                            fd={"row"}
                                        >
                                            <StyledButton
                                                style={{width: 95}}
                                                disabled={claimingNft ? 1 : 0}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    mintFunction();
                                                }}
                                            >
                                                {claimingNft ? "Minting..." : "Mint!"}
                                            </StyledButton>
                                        </s.Container>
                                    </>
                                )}
                            </>
                        )}
                        <s.SpacerMedium />
                    </s.Container>
                    <s.SpacerLarge />
                    <s.Container
                        flex={1} jc={"center"} ai={"center"}
                    ></s.Container>
                </ResponsiveWrapper>
                <s.SpacerMedium />
                <s.Container
                    jc={"center"}
                    ai={"center"}
                    style={{ width: "70%" }}
                >
                    <s.TextDescription
                        style={{
                            textAlign: "center",
                            color: "var(--primary-text)",
                        }}
                    >
                        Please make sure you are connected to the right network (
                        {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
                        Once you make the purchase, you cannot undo this action.
                    </s.TextDescription>
                    <s.SpacerSmall />
{/*                     <s.TextDescription
                        style={{
                            texAlign: "center",
                            color: "var(--primary-text)",
                        }}
                    >
 
                    </s.TextDescription> */}
                </s.Container>
            </s.Container>
        </s.Screen>
    </>
    )
}

export default NavMint