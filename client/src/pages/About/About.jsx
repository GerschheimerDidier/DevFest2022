import React from "react";
import "./About.css";
import Image from './../../assets/photoDevFest.png';

const About = () => {

    return (
        <div className={"about"}>
            <h1>About</h1>
            <h3>Quick project presentation</h3>

            <p>
                This project was made for Strasbourg's <a href='https://devfest.gdgstrasbourg.fr/'>DevFest 2022</a> in order to demonstrate usage of smart contract on the ethereum blockchain<br/><br/>
                The point is to show why and when blockchain can be implemented instead of traditional REST API.
            </p>

            <h3>Team</h3>

            <p>

                <img src={Image} alt={"Team that developed this project"} height={"50%"} width={"50%"} ></img>

            </p>
            <br/>

            <a href='https://github.com/GerschheimerDidier/DevFest2022'><b>Project's Github repository</b></a>
            
            <p className={"explanations"}>
                For interaction with the blockchain you will need a wallet. 
                We use Metamask here, it's a navigator extension which enable you to connect to a local blockchain and interact with it. <span/>

                <a href='https://metamask.io/'>https://metamask.io/</a>
                 
                <br/><br/>

                To test things out we need a local blockchain. We use ganache. <span/>

                <a href='https://trufflesuite.com/ganache/'>https://trufflesuite.com/ganache/</a>

                <br/><br/>

                We use the truffle framework for ease of integration and started the project using the truffle react box. <span/>

                <a href='https://trufflesuite.com/'>https://trufflesuite.com/</a>

                <br/><br/>

                There is three type of contract available so far. A Shared wallet, a Crowdfunding and Common pot. You can create X instance of each from the home page and share it with their address.

                <br/><br/><br/><br/>

                <b>Disclaimer</b><br/><br/>
                There's still some bug in the app, it was build as we discover the subject. It is not best practice guarantee, especially about ReactJS part.


            </p>




        </div>
    );
}

export default About;
