import React from 'react'
import * as s from "../../styles/globalStyles";
import * as x from "./infoElements"
import {
    StyledButton,
    StyledRoundButton,
    ResponsiveWrapper,
    StyledLogo,
    StyledImg,
    StyledLink
} from "../../styles/geral";
import { FaGlobe, FaInstagram, FaSitemap, FaStaylinked, FaTwitch, FaTwitter, FaWeebly } from 'react-icons/fa';

const InfoSection = ({
    id,
    topline,
    headline,
    description,
    description2,
    buttonlabel,
    img,
    alt,
}) => {
  return (
    <>
    <s.Screen id={id}>        
        <s.Container flex={1} jc={"center"} ai={"center"}>
            <s.Container
                flex={1}
                jc={"center"}
                ai={"center"}
                style={{
                    //backgroundColor: "var(--accent)",
                }}
            >
                <s.SpacerLarge />
                <s.SpacerLarge />
                <s.TextTitle
                    style={{
                        //textAlign: "center",
                        //marginRight: 285,
                        fontSize: 50,
                        fontWeight: "bold",
                        color: "var(--accent-text)",
                    }}
                >
                    {topline}
                </s.TextTitle>
                <x.InfoRow>
                  <x.Column1>
                    <s.TextSubTitle
                        style={{
                            //textAlign: "center",
                            marginRight: 285,
                            color: "var(--primary-text)",
                        }}
                    >
                       <FaInstagram />
                        <StyledLink target={"_blank"} href="https://www.instagram.com/goimpacto/">{headline}</StyledLink>
                    </s.TextSubTitle>
                  </x.Column1>
                  <x.Column2>
                    <s.TextSubTitle
                        style={{
                            //textAlign: "center",
                            marginRight: 285,
                            color: "var(--primary-text)",
                            marginRight: "90px"
                        }}
                    >
                       <FaGlobe />
                        <StyledLink target={"_blank"} href="https://goimpacto.com/br">Site</StyledLink>
                    </s.TextSubTitle>
                  </x.Column2>
                </x.InfoRow>
                {/* <x.InfoRow>
                    <x.Column1>
                        <x.TextWrapper>
                            <s.TextDescription style={{textAlign: "justify"}}>
                                {description}
                            </s.TextDescription>
                        </x.TextWrapper>
                        
                    </x.Column1>
                    <s.SpacerSmall />
                    <x.Column2 style={{marginBottom: "100px"}}>
                        <x.TextWrapper> 
                          Twiiter
                        </x.TextWrapper>
                    </x.Column2>
                    
                </x.InfoRow> */}
            </s.Container>
        </s.Container>
    </s.Screen>
    </>
)
}

export default InfoSection