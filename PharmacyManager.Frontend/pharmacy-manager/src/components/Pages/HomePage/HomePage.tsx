import React from "react";

export class HomePage extends React.Component {
    componentDidMount(): void {
        window.document.title = "Pharmacy Manager - Home";
    }
    render(): React.ReactNode {
        return <>Select one of the actions from the menu above</>;
    }
}