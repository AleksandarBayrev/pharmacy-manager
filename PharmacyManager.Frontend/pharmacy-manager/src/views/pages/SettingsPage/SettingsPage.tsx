import React from "react";
import { action, computed, Lambda, observe } from "mobx";
import "../../../shared/Styles.css";
import { LanguageSelector } from "../../../shared";
import { ISettingsStore, ITranslationManager } from "../../../types";
import { observer } from "mobx-react";

type SettingsPageProps = {
    settingsStore: ISettingsStore;
    translationManager: ITranslationManager;
}

@observer
export class SettingsPage extends React.Component<SettingsPageProps> {
    private pageTitleObserver!: Lambda;
    componentDidMount = async () => {
        await this.props.settingsStore.load();
        this.pageTitleObserver = observe(this.props.settingsStore.language, () => {
            window.document.title = this.pageTitle;
        });
        window.document.title = this.pageTitle;
    }

    componentWillUnmount = async () => {
        this.pageTitleObserver();
        await this.props.settingsStore.unload();
    }
    render() {
        return (
            <div className="App-page">
                <div className="App-page-header">{this.props.translationManager.getTranslation(this.props.settingsStore.language.get(), "HEADER_SETTINGS")}</div>
                <div className='App-page-container'>
                    <div className='App-page-row-setting'>
                        <div className='row'>
                            <div className="column">{this.props.translationManager.getTranslation(this.props.settingsStore.language.get(), "FORM_SETTINGS_LANGUAGE")}</div>
                            <div className="column">
                                <LanguageSelector
                                    store={this.props.settingsStore}
                                    translationManager={this.props.translationManager} />
                            </div>
                        </div>
                    </div>
                    <div className='App-page-row-setting'>
                        <div className='row'>
                            <div className="column">{this.props.translationManager.getTranslation(this.props.settingsStore.language.get(), "FORM_SETTINGS_RELOAD_TRANSLATIONS")}</div>
                            <div className="column">
                                <button onClick={this.reloadTranslations}>{this.props.translationManager.getTranslation(this.props.settingsStore.language.get(), "FORM_SETTINGS_RELOAD_TRANSLATIONS")}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    @action
    private reloadTranslations = async () => {
        await this.props.translationManager.reloadTranslations();
        window.location.reload();
    }

    @computed
    private get pageTitle() {
        return `Pharmacy Manager - ${this.props.translationManager.getTranslation(this.props.settingsStore.language.get(), "HEADER_SETTINGS")}`;
    }
}