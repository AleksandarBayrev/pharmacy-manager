import React from "react";
import { observer } from "mobx-react";
import { IAppStore, IGetMedicineListPageStore, ITranslationManager, MedicineRequest } from "../../../../types";
import { ItemsPerPage } from "./pageComponents/ItemsPerPage";
export type PageSettingsProps = {
    store: IGetMedicineListPageStore;
    appStore: IAppStore;
    translationManager: ITranslationManager;
}

@observer
export class PageSettings extends React.Component<PageSettingsProps> {
    private textChangeTimeout: NodeJS.Timeout | undefined = undefined;
    componentWillUnmount() {
        clearTimeout(this.textChangeTimeout);
    }
    render() {
        return (
            <div id="App-page-settings">
                <div className='App-page-row-setting'>
                    <div className='row'>
                        <div className='column'><input id='only-available-medicines' type="checkbox" checked={this.props.store.request.availableOnly} disabled={this.props.store.loadingData.get()} onChange={(e) => this.onCheckboxChange(e, "availableOnly")} /></div>
                        <label className='column' htmlFor='only-available-medicines'>{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_GET_MEDICINE_SHOW_AVAILABLE")}</label>
                    </div>
                </div>
                <div className='App-page-row-setting'>
                    <div className='row'>
                        <div className='column'><input id='only-not-expired-medicines' type="checkbox" checked={this.props.store.request.notExpired} disabled={this.props.store.loadingData.get()} onChange={(e) => this.onCheckboxChange(e, "notExpired")} /></div>
                        <label className='column' htmlFor='only-not-expired-medicines'>{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_GET_MEDICINE_SHOW_NOT_EXPIRED")}</label>
                    </div>
                </div>
                <div className='App-page-row-setting'>
                    <div className='row'>
                        <div className='column'>{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_GET_MEDICINE_PAGE")}</div>
                        <div className='column'><input type="text" onChange={this.onPageChange} placeholder={this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_GET_MEDICINE_PAGE")} value={this.props.store.request.page} disabled={this.props.store.loadingData.get() || this.props.store.isLoadingPage.get()} />
                        </div>
                    </div>
                </div>
                <div className='App-page-row-setting'>
                    <div className='row'>
                        <div className='column'>{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_GET_MEDICINE_ITEMS_PER_PAGE")}</div>
                        <div className='column'>{this.getItemsPerPageComponent(this.onSelectChange, this.props.store.request.itemsPerPage, this.props.store.loadingData.get())}</div>
                    </div>
                </div>
                <div className='App-page-row-setting'>
                    <div className='row'>
                        <div className='column'>{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_GET_MEDICINE_MANUFACTURER")}</div>
                        <div className='column'>{this.renderTextBox((e) => this.onTextChange(e, "manufacturer"), this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_GET_MEDICINE_MANUFACTURER"), this.props.store.request.manufacturer, this.props.store.loadingData.get())}</div>
                    </div>
                </div>
                <div className='App-page-row-setting'>
                    <div className='row'>
                        <div className='column'><button onClick={this.onResetRequest} disabled={this.props.store.loadingData.get()}>{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_GET_MEDICINE_RESET_REQUEST")}</button></div>
                    </div>
                </div>
                <div className='App-page-row-setting'>
                    <div className='row'>
                        <div className='column'>{this.renderPageCountText(this.props.store.showPageCount.get(), this.props.store.pages.get())}</div>
                    </div>
                </div>
            </div>
        )
    }

    private getItemsPerPageComponent(
        onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
        itemsPerPage: number,
        loadingData: boolean
    ) {
        const options: number[] = [10, 15, 20, 50, 100, 500];
        return <ItemsPerPage
            options={options}
            onChangeHandler={onSelectChange}
            selectedOption={itemsPerPage}
            shouldDisable={loadingData} />;
    }

    private renderPageCountText(showPageCount: boolean, pages: number) {
        const availablePagesText = this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_GET_MEDICINE_AVAILABLE_PAGES");
        const loadingPageCountText = this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_GET_MEDICINE_LOADING_PAGE_COUNT");
        return showPageCount ? `${availablePagesText} ${pages}` : loadingPageCountText;
    }
    
    private renderTextBox(textChangeHandler: (
        e: React.ChangeEvent<HTMLInputElement>) => void,
        placeholder: string,
        value: string,
        disabled: boolean) {
        return <input type="text" onChange={textChangeHandler} placeholder={placeholder} value={value} disabled={disabled} />
    }

    private onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const updatedProp: Partial<MedicineRequest> = {};
      updatedProp["itemsPerPage"] = parseInt(e.target.value);
      this.props.store.stopUpdateInterval();
      this.props.store.updateRequestProperties(updatedProp);
      this.props.store.refetch(false);
    }
  
    private onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, prop: "availableOnly" | "notExpired") => {
      const updatedProp: Partial<MedicineRequest> = {};
      updatedProp[prop] = e.target.checked;
      this.props.store.stopUpdateInterval();
      this.props.store.updateRequestProperties(updatedProp);
      this.props.store.refetch(false);
    }
  
    private onTextChange = async (e: React.ChangeEvent<HTMLInputElement>, prop: "manufacturer") => {
      const updatedProp: Partial<MedicineRequest> = {};
      updatedProp[prop] = e.target.value;
      if (this.textChangeTimeout) {
        clearTimeout(this.textChangeTimeout);
        this.props.store.stopUpdateInterval();
      }
      this.props.store.updateRequestProperties(updatedProp);
      this.textChangeTimeout = setTimeout(() => {
        this.props.store.refetch(true);
      }, 1000);
    }
  
    private onPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedProp: Partial<MedicineRequest> = {};
      updatedProp["page"] = parseInt(e.target.value);
      this.props.store.stopUpdateInterval();
      this.props.store.updateRequestProperties(updatedProp);
      this.props.store.refetch(false);
    }

    private onResetRequest = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.props.store.resetRequestToDefaults(true);
    }
}