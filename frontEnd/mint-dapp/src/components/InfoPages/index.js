import React from 'react'
import * as s from "../../styles/globalStyles";
import * as x from "./infoElements";
import {
    StyledButton,
    StyledRoundButton,
    ResponsiveWrapper,
    StyledLogo,
    StyledImg,
    StyledLink
} from "../../styles/geral";

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
                        marginRight: 285,
                        fontSize: 50,
                        fontWeight: "bold",
                        color: "var(--accent-text)",
                    }}
                >
                    {topline}
                </s.TextTitle>
                <s.TextSubTitle
                    style={{
                        //textAlign: "center",
                        marginRight: 285,
                        color: "var(--primary-text)",
                    }}
                >
                    {headline}
                </s.TextSubTitle>
                <x.InfoRow>
                    <x.Column1>
                        <x.TextWrapper>
                            <s.TextDescription style={{textAlign: "justify"}}>
                                {description}
                            </s.TextDescription>
                        </x.TextWrapper>
                        
                    </x.Column1>
                    <s.SpacerSmall />
                    <x.Column2 style={{marginBottom: "100px"}}>
                        <x.Img src={img}/>
                        {/* <x.TextWrapper>
                            <s.TextDescription>
                                {description2}
                            </s.TextDescription>
                        </x.TextWrapper> */}
                    </x.Column2>
                    
                </x.InfoRow>
            </s.Container>
        </s.Container>
    </s.Screen>
    </>
)
}

export default InfoSection