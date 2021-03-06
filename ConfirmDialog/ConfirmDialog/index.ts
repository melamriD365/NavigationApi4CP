import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class ConfirmDialog implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    private _displayState: string | null;
    private _confirmDialogResponse: boolean | null;
    /**
     * Empty constructor.
     */
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        this._notifyOutputChanged = notifyOutputChanged;
        this._context = context;
        this._displayState = context.parameters.displayState.raw;
        this._confirmDialogResponse = context.parameters.confirmDialogResponse.raw;
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        let self = this;
        self._context = context;
        self._displayState = context.parameters.displayState.raw;
        switch (this._displayState) {
            case "closed":
                break;
            case "opened":
                break;
            case "open":
                self._displayState = "opened";
                self._notifyOutputChanged();
                let ConfirmDialogStrings = {
                    title: this._context.parameters.title.raw!,
                    subtitle: this._context.parameters.subtitle.raw!,
                    text: this._context.parameters.text.raw!,
                    confirmButtonLabel: this._context.parameters.confirmButtonLabel.raw!, 
                    cancelButtonLabel: this._context.parameters.cancelButtonLabel.raw!
                }
                let options = {
                    height: this._context.parameters.height.raw!,
                    width: this._context.parameters.width.raw!
                }
                this._context.navigation.openConfirmDialog(ConfirmDialogStrings, options).then(
                    function success(result) {
                        self._displayState = "closed";
                        self._confirmDialogResponse = result.confirmed;
                        self._notifyOutputChanged();
                    },
                    function () {
                    }
                )
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as ???bound??? or ???output???
     */
    public getOutputs(): IOutputs
    {
        return {
            displayState: this._displayState!,
            confirmDialogResponse: this._confirmDialogResponse!
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }
}
