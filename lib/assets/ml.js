import { Base } from "./base.js";

const TrainDataModel = (current_namespace) => {
    return {
        name: "TrainDataModel",

        components: {
            BaseInput: Base.BaseInput,
            BaseSelect: Base.BaseSelect,
        },

        props: {
            fields: {
                type: Object,
                default: {},
            }
        },

        data() {
            return {
                x_type: [
                    { label: "32-bit Float", value: "f32" },
                    { label: "32-bit Integer", value: "s32" }
                ],
                y_type:  [
                    { label: "32-bit Float", value: "f32" },
                    { label: "32-bit Integer", value: "s32" }
                ],
                data_layout: [
                    { label: "Row", value: "row" },
                    { label: "Column", value: "col" }
                ],
                shuffle_dataset: [
                    { label: "Yes", value: true },
                    { label: "No", value: false }
                ]
            }
        },

        template: `
        <div class="row mixed-row">
            <BaseInput
                name="${current_namespace}x"
                label="Data Variable (X)"
                type="text"
                v-model="fields.x"
                inputClass="input"
                :grow
                :required
            />
            <BaseSelect
                name="${current_namespace}x_type"
                label="Data Type"
                v-model="fields.x_type"
                :options="x_type"
                selectClass="input input-icon"
                :grow
                :required
            />
        </div>
        <div class="row mixed-row">
            <BaseInput
                name="${current_namespace}y"
                label="Label Variable (y)"
                type="text"
                v-model="fields.y"
                inputClass="input"
                :grow
                :required
            />
            <BaseSelect
                name="${current_namespace}y_type"
                label="Label Type"
                v-model="fields.y_type"
                :options="y_type"
                selectClass="input input-icon"
                :grow
                :required
            />
        </div>
        <div class="row mixed-row">
            <BaseSelect
                name="${current_namespace}data_layout"
                label="Data Layout"
                v-model="fields.data_layout"
                :options="data_layout"
                selectClass="input input-icon"
                :grow
                :required
            />
            <BaseInput
                name="${current_namespace}split_ratio"
                label="Train/Test Split Ratio"
                type="number"
                v-model="fields.split_ratio"
                inputClass="input"
                :grow
                :required
            />
            <BaseSelect
                name="${current_namespace}shuffle_dataset"
                label="Shuffle Dataset"
                v-model="fields.shuffle_dataset"
                :options="shuffle_dataset"
                selectClass="input input-icon"
                :grow
                :required
            />
        </div>
        <div class="row mixed-row">
            <BaseInput
                name="${current_namespace}to_variable"
                label="Save TrainData to Variable"
                type="text"
                v-model="fields.to_variable"
                inputClass="input"
                :grow
                :required
            />
        </div>
        `,
    }
};

const DTreesModel = (current_namespace, opts) => {
    var use_data = "";
    if (opts.enable_input === true) {
        if (opts.input_use_traindata_var == true) {
            use_data = `
            <div class="row mixed-row">
                <BaseInput
                    name="${current_namespace}traindata_var"
                    label="TrainData variable name"
                    type="text"
                    v-model="fields.traindata_var"
                    inputClass="input"
                    :grow
                    :required
                />
            </div>
            `;
        } else {
            use_data = `
            <TrainDataModel v-bind:fields="fields.traindata" />
            `;
        }
    }

    var to_variable = "";
    if (opts.enable_output === true) {
        to_variable = `
        <div class="row mixed-row">
            <BaseInput
                name="${current_namespace}to_dtrees_variable"
                label="Save DTrees to variable"
                type="text"
                v-model="fields.to_dtrees_variable"
                inputClass="input"
                :grow
                :required
            />
        </div>
        `;
    }

    return {
        name: "DTreesModel",

        components: {
            BaseInput: Base.BaseInput,
            TrainDataModel: TrainDataModel(current_namespace + "traindata."),
        },

        props: {
            fields: {
                type: Object,
                default: {},
            },
        },

        template: `
        ${use_data}
        <div class="row mixed-row">
            <BaseInput
                name="${current_namespace}max_depth"
                label="Max Depth"
                labelTooltip="The maximum possible depth of the tree. That is the training algorithms attempts to split a node while its depth is less than maxDepth. The root node has zero depth."
                type="number"
                v-model="fields.max_depth"
                inputClass="input input--xs input--number"
                :grow
                :required
            />
            <BaseInput
                name="${current_namespace}max_categories"
                label="Max Categories"
                labelTooltip="Cluster possible values of a categorical variable into K<=maxCategories clusters to find a suboptimal split."
                type="number"
                v-model="fields.max_categories"
                inputClass="input input--xs input--number"
                :grow
                :required
            />
            <BaseInput
                name="${current_namespace}min_sample_count"
                label="Min Sample Count"
                labelTooltip="If the number of samples in a node is less than this parameter then the node will not be split."
                type="number"
                v-model="fields.min_sample_count"
                inputClass="input input--xs input--number"
                :grow
                :required
            />
        </div>
        ${to_variable}
        `,
    }
};

const RTreesModel = (current_namespace, opts) => {
    var use_data = "";
    if (opts.enable_input === true) {
        if (opts.input_use_traindata_var == true) {
            use_data = `
            <div class="row mixed-row">
                <BaseInput
                    name="${current_namespace}traindata_var"
                    label="TrainData variable name"
                    type="text"
                    v-model="fields.traindata_var"
                    inputClass="input"
                    :grow
                    :required
                />
            </div>
            `;
        } else {
            use_data = `
            <TrainDataModel v-bind:fields="fields.traindata" />
            `;
        }
    }

    var to_variable = "";
    if (opts.enable_output === true) {
        to_variable = `
        <div class="row mixed-row">
            <BaseInput
                name="${current_namespace}to_variable"
                label="Save RTrees to variable"
                type="text"
                v-model="fields.to_variable"
                inputClass="input"
                :grow
                :required
            />
        </div>
        `;
    }

    return {
        name: "RTreesModel",

        components: {
            BaseInput: Base.BaseInput,
            BaseSelect: Base.BaseSelect,
            TrainDataModel: TrainDataModel(current_namespace + "traindata."),
            DTreesWithTrainDataVar: DTreesModel(current_namespace + "dtrees.", {}),
            DTreesWithTrainData: DTreesModel(current_namespace + "dtrees.", {}),
        },

        props: {
            fields: {
                type: Object,
                default: {},
            },
        },

        data() {
            return {
                calculate_var_importance: [
                    { label: "Yes", value: true },
                    { label: "No", value: false }
                ],
                term_criteria_type: [
                    { label: "Maximum Count", value: "max_count" },
                    { label: "Epsilon", value: "eps"},
                    { label: "Maximum Count + Epsilon", value: "max_count+eps"}
                ]
            }
        },

        template: `
        ${use_data}
        <DTreesWithTrainData v-bind:fields="fields.dtrees" />
        <div class="row mixed-row">
            <BaseInput
                name="active_var_count"
                label="Active Var Count"
                labelTooltip="The size of the randomly selected subset of features at each tree node and that are used to find the best split(s). If you set it to 0 then the size will be set to the square root of the total number of features. Default value is 0."
                type="number"
                v-model="fields.active_var_count"
                inputClass="input input--xs input--number"
                :grow
                :required
            />
            <BaseSelect
                name="calculate_var_importance"
                label="Calculate Var Importance"
                labelTooltip="If true then variable importance will be calculated and then it can be retrieved by RTrees.getVarImportance/1. Default value is false."
                v-model="fields.calculate_var_importance"
                :options="calculate_var_importance"
                selectClass="input input-icon"
                :grow
                :required
            />
        </div>
        <div class="row mixed-row">
            <BaseSelect
                name="term_criteria_type"
                label="Termination Criteria Type"
                v-model="fields.term_criteria_type"
                :options="term_criteria_type"
                selectClass="input input--xs"
                :grow
                :required
            />
            <BaseInput
                name="term_criteria_count"
                label="Maximum Count"
                labelTooltip="The maximum number of iterations/elements"
                type="number"
                v-model="fields.term_criteria_count"
                inputClass="input input--xs input--number"
                :grow
                :required
            />
            <BaseInput
                name="term_criteria_eps"
                label="Epsilon"
                labelTooltip="The desired accuracy"
                type="number"
                v-model="fields.term_criteria_eps"
                inputClass="input input--xs input--number"
                :grow
                :required
            />
        </div>
        ${to_variable}
        `,
    }
};

const TrainDataSmartCellConfig = (ctx, info) => {
    const extra_components = {
        TrainDataModel: TrainDataModel(""),
    };
    var config = Base.SmartCellConfig(ctx, info, extra_components, {});
    config.template = `
    <div class="app">
      <form @change="handleFieldChange">
        <div class="container">
          <TrainDataModel v-bind:fields="fields" />
        </div>
      </form>
    </div>
    `;
    return config;
}

const DTreesSmartCellConfig = (ctx, info) => {
    const extra_components = {
        DTreesWithTrainDataVar: DTreesModel("", {enable_input: true, input_use_traindata_var: true, enable_output: true}),
        DTreesWithTrainData: DTreesModel("", {enable_input: true, input_use_traindata_var: false, enable_output: true}),
    };
    const extra_data = {
        data_from: [
            { label: "TrainData Variable", value: "traindata_var" },
            { label: "Immediate TrainData", value: "traindata" },
        ]
    };
    var config = Base.SmartCellConfig(ctx, info, extra_components, extra_data);
    config.template = `
    <div class="app">
        <form @change="handleFieldChange">
        <div class="container">
            <div class="row header">
            <BaseSelect
                name="data_from"
                label=" Use data from "
                v-model="fields.data_from"
                selectClass="input input--xs"
                :inline
                :options="data_from"
            />
            </div>
            <DTreesWithTrainDataVar v-bind:fields="fields" v-if="isTrainDataVar" />
            <DTreesWithTrainData v-bind:fields="fields" v-if="isTrainData" />
        </div>
        </form>
    </div>
    `;
    config.computed = {
        isTrainDataVar() {
            return this.fields.data_from === "traindata_var";
        },
        isTrainData() {
            return this.fields.data_from === "traindata";
        },
    };

    return config;
}

const RTreesSmartCellConfig = (ctx, info) => {
    const extra_components = {
        RTreesWithTrainDataVar: RTreesModel("", {enable_input: true, input_use_traindata_var: true, enable_output: true}),
        RTreesWithTrainData: RTreesModel("", {enable_input: true, input_use_traindata_var: false, enable_output: true}),
    };
    const extra_data = {
        data_from: [
            { label: "TrainData Variable", value: "traindata_var" },
            { label: "Immediate TrainData", value: "traindata" },
        ]
    };

    var config = Base.SmartCellConfig(ctx, info, extra_components, extra_data);
    config.template = `
    <div class="app">
        <form @change="handleFieldChange">
        <div class="container">
            <div class="row header">
            <BaseSelect
                name="data_from"
                label=" Use data from "
                v-model="fields.data_from"
                selectClass="input input--xs"
                :inline
                :options="data_from"
            />
            </div>
            <RTreesWithTrainDataVar v-bind:fields="fields" v-if="isTrainDataVar" />
            <RTreesWithTrainData v-bind:fields="fields" v-if="isTrainData" />
        </div>
        </form>
    </div>
    `;
    config.computed = {
        isTrainDataVar() {
            return this.fields.data_from === "traindata_var";
        },
        isTrainData() {
            return this.fields.data_from === "traindata";
        },
    };

    return config;
}

export const ML = {
    TrainDataModel: TrainDataModel,
    DTreesModel: DTreesModel,
    RTreesModel: RTreesModel,
    SmartCell: {
        "evision.ml.traindata": TrainDataSmartCellConfig,
        "evision.ml.dtrees": DTreesSmartCellConfig,
        "evision.ml.rtrees": RTreesSmartCellConfig,
    }
};