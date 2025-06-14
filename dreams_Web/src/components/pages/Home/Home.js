import React, { Component } from "react"
import "./Home.css"
import { Link } from "react-router-dom"
import dev_gi from "../../../assets/images/dev_gi.png"
import dev_ga from "../../../assets/images/dev_ga.jpeg"

import { BsGithub } from "react-icons/bs"

export default class Home extends Component {

    renderBanner() {
        return (
            <div className="banner" id="home">
                <div className="container">
                    <div className="contentBox">
                        <div>
                            <h1 className="an-expansion an-inf-expansion">A vidente que vê</h1>
                            <p className="an-fadeIn  esconder">
                           Resolva problemas futuros e atuais 
                            </p>
                            <Link to="/realidade" >
                                <a className="btnD1 an-fadeIn-btn">Comece sua consulta  </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderDevelopers() {
        return (
            <div id="speakers" className="section-developers wf-section">
               
            </div>
        )
    }


    render() {
        return (
            <>
                <main className="principal dark" >
                    {this.renderBanner()} { /* Renderiza o banner principal com o castelo e dreams come true*/}s
                </main>
            </>
        )
    }
}
