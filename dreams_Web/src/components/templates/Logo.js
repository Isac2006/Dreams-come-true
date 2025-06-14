import "./Logo.css"
import React from "react"
import logo from "../../assets/images/castelo.jpg"

export default function Logo(_props) {
    return (
        <aside className="logo">
            <a href="/" className="logo">
                <img src={ logo } alt="Logo" />
            </a>
        </aside>
    )
}