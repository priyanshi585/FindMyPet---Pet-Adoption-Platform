// import React, { useEffect, props } from "react";
// import { useNavigate } from "react-router";
// import SignUp from "./SignUp";
// import SignIn from "./SignIn";
// // import Navbar from "./Components/NavBar/Navbar";
// import {
//   Box,
//   Container,
//   Tabs,
//   Flex,
//   TabList,
//   Tab,
//   TabPanels,
//   TabPanel,
//   Text,
// } from "@chakra-ui/react"; // Correct imports
// import Cookies from "js-cookie";
// import developerPng from "./images/developer-png.png";
// import logo from "./images/logo.png";
// import { Link } from "react-router-dom";




// const HomePage = () => {
//   const navigate = useNavigate();
//   useEffect(() => {
//     // const user = JSON.parse(sessionStorage.getItem("User"))
//     const user = Cookies.get("homegate-token");
//     // console.log(user)
//     if (user) {
//       navigate("/home");
//     }
//   }, [navigate]);

//   return (
//     <>
//       <div className="login">
//         <Link className="logo-container" to="/">
//           <img className="navbar-logo" src={logo} alt="HomeGate Logo" />
//           <p>FindMyPet</p>
//         </Link>
//       </div>
    
//     <div className="login-body">
    
//       <Container
//         maxW="xl"
//         centerContent
//         minHeight="100vh"
//         display="flex"
//         flexDirection="column"
//         justifyContent="center"
//       >
        
//         {/* <Box
//           bg="white"
//           w="100%"
//           // w={{ base: "90%", md: "60%", lg: "40%" }}
//           p={4}
//           borderRadius="lg"
//           color="black"
//           borderWidth="1px"
//           overflowY="auto"
//           maxHeight="80vh"
//         >
//           <Tabs variant="soft-rounded">
//             <TabList mb="1em">
//               <Tab width="50%">SIGN IN</Tab>
//               <Tab width="50%">SIGN UP</Tab>
//             </TabList>
//             <TabPanels>
//               <TabPanel>
//                 <SignIn />
//               </TabPanel>
//               <TabPanel>
//                 <SignUp />
//               </TabPanel>
//             </TabPanels>
//           </Tabs>
//         </Box> */}
//         <Flex
//           w="100%"
//           h="100%"
//           maxW="1200px"
//           mx="auto"
//           align="center"
//           justify="space-between"
//           gap={100}
//         >
//           {/* LEFT: WHITE LOGIN BOX */}
//           <Box
//             bg="white"
//             w={{ base: "100%", md: "45%" }}
//             minW="380px"
//             p={8}
//             borderRadius="lg"
//             borderWidth="1px"
//           >
//             <Tabs variant="soft-rounded">
//               <TabList mb="1em">
//                 <Tab width="50%">SIGN IN</Tab>
//                 <Tab width="50%">SIGN UP</Tab>
//               </TabList>

//               <TabPanels>
//                 <TabPanel>
//                   <SignIn />
//                 </TabPanel>
//                 <TabPanel>
//                   <SignUp />
//                 </TabPanel>
//               </TabPanels>
//             </Tabs>
//           </Box>

//           {/* RIGHT: IMAGE OUTSIDE WHITE BOX */}
//           <Box
//             w={{ base: "100%", md: "55%" }}
//             display={{ base: "none", md: "block" }}
//             justifyContent="center"
//             h="100%"
//           >
//             <img
//               src={developerPng}
//               alt="Developer"
//               style={{
//                 width: "3000%",
//                 height: "auto",
//                 maxWidth: "450px",
//               }}
//             />
//           </Box>
//         </Flex>
//       </Container>
//     </div>
//     </>
//   );
// };

// export default HomePage;


import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import {
  Box,
  Container,
  Tabs,
  Flex,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import developerPng from "./images/developer-png.png";
import logo from "./images/logo.png";
import { Link } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = Cookies.get("homegate-token");
    if (user) navigate("/home");
  }, [navigate]);

  // return (
  //   // <>
  //   //   {/* TOP LOGO */}
  //   //   <Box position="absolute" top="20px" left="20px">
  //   //     <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  //   //       <img src={logo} alt="logo" width="40" />
  //   //       <b>FindMyPet</b>
  //   //     </Link>
  //   //   </Box>

  //   //   {/* FULL SCREEN CENTER */}
  //   //   <Flex
  //   //     minH="100vh"
  //   //     align="center"
  //   //     justify="center"
  //   //     bgGradient="linear(to-r, orange.400, orange.300)"
  //   //   >
  //   //     <Container maxW="1200px">
  //   //       <Flex
  //   //         align="center"
  //   //         justify="space-between"
  //   //         gap={12}
  //   //       >
  //   //         {/* LEFT FORM */}
  //   //         <Box
  //   //           bg="white"
  //   //           w="45%"
  //   //           minW="380px"
  //   //           p={8}
  //   //           borderRadius="lg"
  //   //           boxShadow="lg"
  //   //         >
  //   //           <Tabs variant="soft-rounded">
  //   //             <TabList mb="1em">
  //   //               <Tab width="50%">SIGN IN</Tab>
  //   //               <Tab width="50%">SIGN UP</Tab>
  //   //             </TabList>

  //   //             <TabPanels>
  //   //               <TabPanel>
  //   //                 <SignIn />
  //   //               </TabPanel>
  //   //               <TabPanel>
  //   //                 <SignUp />
  //   //               </TabPanel>
  //   //             </TabPanels>
  //   //           </Tabs>
  //   //         </Box>

  //   //         {/* RIGHT IMAGE */}
  //   //         <Box w="50%" display={{ base: "none", md: "flex" }} justifyContent="center">
  //   //           <img
  //   //             src={developerPng}
  //   //             alt="Developer"
  //   //             style={{
  //   //               width: "100%",
  //   //               maxWidth: "450px",
  //   //               height: "auto",
  //   //             }}
  //   //           />
  //   //         </Box>
  //   //       </Flex>
  //   //     </Container>
  //   //   </Flex>
  //   // </>
  // );
  return (
  <>
    {/* ===== NAVBAR ===== */}
    <Box bg="white" px={8} py={4} boxShadow="sm">
      <Flex maxW="1200px" mx="auto" align="center">
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginLeft: "10px", // 👈 thoda left spacing
          }}
        >
          <img src={logo} alt="logo" width="40" />
          <b>FindMyPet</b>
        </Link>
      </Flex>
    </Box>

    {/* ===== YELLOW SECTION ===== */}
    <Flex
      minH="calc(100vh - 72px)" // navbar height subtract
      align="center"
      justify="center"
      bgGradient="linear(to-br, orange.400, orange.500)"
    >
      <Flex
        maxW="1200px"
        w="100%"
        align="center"
        justify="space-between"
        px={8}
      >
        {/* ===== LEFT FORM ===== */}
        <Box
          bg="white"
          w={{ base: "100%", md: "420px" }}
          p={8}
          borderRadius="lg"
          boxShadow="xl"
        >
          <Tabs variant="soft-rounded">
            <TabList mb="1em">
              <Tab width="50%">SIGN IN</Tab>
              <Tab width="50%">SIGN UP</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <SignIn />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* ===== RIGHT IMAGE ===== */}
        <Box
          display={{ base: "none", md: "flex" }}
          justifyContent="flex-end"
          flex="1"
        >
          <img
            src={developerPng}
            alt="Developer"
            style={{
              maxWidth: "450px",
              width: "100%",
              height: "auto",
            }}
          />
        </Box>
      </Flex>
    </Flex>
  </>
);

};

export default HomePage;
