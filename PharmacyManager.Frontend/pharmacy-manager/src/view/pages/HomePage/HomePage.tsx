import React from "react";
import "../../../shared/Styles.css";

export class HomePage extends React.Component {
    componentDidMount(): void {
        window.document.title = "Pharmacy Manager - Home";
    }
    render(): React.ReactNode {
        return (
            <div className="App-page">
                <div className="App-page-header">Select one of the actions from the menu above</div>
            </div>
        );
    }
}