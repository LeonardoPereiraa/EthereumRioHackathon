import React, { useState } from "react";
import InfoSection from "./components/InfoPages";
import { homeObjOne, homeObjTwo } from "./components/InfoPages/Data";
import Follow from "./components/Links";
import { homeObjThree } from "./components/Links/Data";
import NavMint from "./NavMint";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <NavMint />
      <InfoSection {...homeObjOne} />
      <InfoSection {...homeObjTwo} />
      <Follow {...homeObjThree} />
    </>
  );
}

export default App;
