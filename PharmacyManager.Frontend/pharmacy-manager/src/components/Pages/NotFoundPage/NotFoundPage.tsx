import React from "react";
import "../../Shared/Styles.css";

export type NotFoundPageProps = {
    path: string;
}

export class NotFoundPage extends React.Component<NotFoundPageProps> {
    render() {
        return (
            <div className="App-page">
                <div className="App-page-header">Requested path was not found: {this.props.path}</div>
            </div>
        )
    }
}