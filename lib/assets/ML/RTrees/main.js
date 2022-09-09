import * as Vue from "https://cdn.jsdelivr.net/npm/vue@3.2.26/dist/vue.esm-browser.prod.js";

export function init(ctx, info) {
  ctx.importCSS("main.css");
  ctx.importCSS(
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"
  );

  const BaseSelect = {
    name: "BaseSelect",

    props: {
      label: {
        type: String,
        default: "",
      },
      labelTooltip: {
        type: String,
        default: "",
      },
      selectClass: {
        type: String,
        default: "input",
      },
      modelValue: {
        type: String,
        default: "",
      },
      options: {
        type: Array,
        default: [],
        required: true,
      },
      required: {
        type: Boolean,
        default: false,
      },
      inline: {
        type: Boolean,
        default: false,
      },
      grow: {
        type: Boolean,
        default: false,
      },
    },

    methods: {
      available(value, options) {
        return value
          ? options.map((option) => option.value).includes(value)
          : true;
      },
      hasTooltip(labelTooltip) {
        return labelTooltip.length > 0;
      }
    },

    template: `
    <div v-bind:class="[inline ? 'inline-field' : 'field', grow ? 'grow' : '']">
      <label v-bind:class="inline ? 'inline-input-label' : 'input-label'">
        {{ label }}
      </label>
      <label v-bind:class="inline ? 'inline-input-label-tooltip' : 'input-label-tooltip'" v-if:"hasTooltip(labelTooltip)">
        {{ labelTooltip }}
      </label>
      <select
        :value="modelValue"
        v-bind="$attrs"
        @change="$emit('update:modelValue', $event.target.value)"
        v-bind:class="[selectClass, { unavailable: !available(modelValue, options) }]"
      >
        <option v-if="!required && !available(modelValue, options)"></option>
        <option
          v-for="option in options"
          :value="option.value"
          :key="option"
          :selected="option.value === modelValue"
        >{{ option.label }}</option>
        <option
          v-if="!available(modelValue, options)"
          class="unavailable"
          :value="modelValue"
        >{{ modelValue }}</option>
      </select>
    </div>
    `,
  };

  const BaseInput = {
    name: "BaseInput",
    props: {
      label: {
        type: String,
        default: "",
      },
      labelTooltip: {
        type: String,
        default: "",
      },
      inputClass: {
        type: String,
        default: "input",
      },
      modelValue: {
        type: [String, Number],
        default: "",
      },
      inline: {
        type: Boolean,
        default: false,
      },
      grow: {
        type: Boolean,
        default: false,
      },
      number: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      emptyClass() {
        if (this.modelValue === "") {
          return "empty";
        }
      },
    },

    methods: {
      hasTooltip(labelTooltip) {
        return labelTooltip.length > 0;
      }
    },

    template: `
    <div v-bind:class="[inline ? 'inline-field' : 'field', grow ? 'grow' : '']">
      <label v-bind:class="inline ? 'inline-input-label' : 'input-label'">
        {{ label }}
      </label>
      <label v-bind:class="inline ? 'inline-input-label-tooltip' : 'input-label-tooltip'" v-if:"hasTooltip(labelTooltip)">
        {{ labelTooltip }}
      </label>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        v-bind="$attrs"
        v-bind:class="[inputClass, number ? 'input-number' : '', emptyClass]"
      >
    </div>
    `,
  };

  const RTreesFormCustom = {
    name: "RTreesFormCustom",

    components: {
      BaseInput: BaseInput,
      BaseSelect: BaseSelect,
    },

    props: {
      fields: {
        type: Object,
        default: {},
      },
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
        ],
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
    <div class="row mixed-row">
      <BaseInput
        name="x"
        label="Data Variable (X)"
        type="text"
        v-model="fields.x"
        inputClass="input"
        :grow
        :required
      />
      <BaseSelect
        name="x_type"
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
        name="y"
        label="Label Variable (y)"
        type="text"
        v-model="fields.y"
        inputClass="input"
        :grow
        :required
      />
      <BaseSelect
        name="y_type"
        label="Label Type"
        v-model="fields.y_type"
        :options="y_type"
        selectClass="input input-icon"
        :grow
        :required
      />
    </div>
    <div class="row mixed-row">
      <BaseInput
        name="dataset_to_variable"
        label="Save dataset (TrainData) to variable"
        type="text"
        v-model="fields.dataset_to_variable"
        inputClass="input"
        :grow
        :required
      />
      <BaseSelect
        name="data_layout"
        label="Data Layout"
        v-model="fields.data_layout"
        :options="data_layout"
        selectClass="input input-icon"
        :grow
        :required
      />
      <BaseInput
        name="split_ratio"
        label="Train/Test Split Ratio"
        type="number"
        v-model="fields.split_ratio"
        inputClass="input"
        :grow
        :required
      />
      <BaseSelect
        name="shuffle_dataset"
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
        name="max_depth"
        label="Max Depth"
        labelTooltip="The maximum possible depth of the tree. That is the training algorithms attempts to split a node while its depth is less than maxDepth. The root node has zero depth."
        type="number"
        v-model="fields.max_depth"
        inputClass="input input--xs input--number"
        :grow
        :required
      />
      <BaseInput
        name="max_categories"
        label="Max Categories"
        labelTooltip="Cluster possible values of a categorical variable into K<=maxCategories clusters to find a suboptimal split."
        type="number"
        v-model="fields.max_categories"
        inputClass="input input--xs input--number"
        :grow
        :required
      />
      <BaseInput
        name="min_sample_count"
        label="Min Sample Count"
        labelTooltip="If the number of samples in a node is less than this parameter then the node will not be split."
        type="number"
        v-model="fields.min_sample_count"
        inputClass="input input--xs input--number"
        :grow
        :required
      />
    </div>
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
        name="eps"
        label="Epsilon"
        labelTooltip="The desired accuracy"
        type="number"
        v-model="fields.term_criteria_eps"
        inputClass="input input--xs input--number"
        :grow
        :required
      />
    </div>
    <div class="row mixed-row">
      <BaseInput
        name="to_variable"
        label="Save RTrees to variable"
        type="text"
        v-model="fields.to_variable"
        inputClass="input"
        :grow
        :required
      />
    </div>
    `,
  };

  const RTreesFormTrainData = {
    name: "RTreesFormTrainData",

    components: {
      BaseInput: BaseInput,
      BaseSelect: BaseSelect,
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
    <div class="row mixed-row">
      <BaseInput
        name="traindata"
        label="TrainData variable name"
        type="text"
        v-model="fields.traindata"
        inputClass="input"
        :grow
        :required
      />
    </div>
    <div class="row mixed-row">
      <BaseInput
        name="max_depth"
        label="Max Depth"
        labelTooltip="The maximum possible depth of the tree. That is the training algorithms attempts to split a node while its depth is less than maxDepth. The root node has zero depth."
        type="number"
        v-model="fields.max_depth"
        inputClass="input input--xs input--number"
        :grow
        :required
      />
      <BaseInput
        name="max_categories"
        label="Max Categories"
        labelTooltip="Cluster possible values of a categorical variable into K<=maxCategories clusters to find a suboptimal split."
        type="number"
        v-model="fields.max_categories"
        inputClass="input input--xs input--number"
        :grow
        :required
      />
      <BaseInput
        name="min_sample_count"
        label="Min Sample Count"
        labelTooltip="If the number of samples in a node is less than this parameter then the node will not be split."
        type="number"
        v-model="fields.min_sample_count"
        inputClass="input input--xs input--number"
        :grow
        :required
      />
    </div>
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
        name="eps"
        label="Epsilon"
        labelTooltip="The desired accuracy"
        type="number"
        v-model="fields.term_criteria_eps"
        inputClass="input input--xs input--number"
        :grow
        :required
      />
    </div>
    <div class="row mixed-row">
      <BaseInput
        name="to_variable"
        label="Save to variable"
        type="text"
        v-model="fields.to_variable"
        inputClass="input"
        :grow
        :required
      />
    </div>
    `,
  };

  const app = Vue.createApp({
    components: {
      BaseInput: BaseInput,
      BaseSelect: BaseSelect,
      RTreesFormCustom: RTreesFormCustom,
      RTreesFormTrainData: RTreesFormTrainData,
    },

    template: `
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
          <RTreesFormCustom v-bind:fields="fields" v-if="isCustom" />
          <RTreesFormTrainData v-bind:fields="fields" v-if="isTrainData" />
        </div>
      </form>
    </div>
    `,

    data() {
      return {
        fields: info.fields,
        data_from: [
          { label: "TrainData", value: "traindata" },
          { label: "Custom", value: "custom" },
        ]
      };
    },

    computed: {
      isCustom() {
        return this.fields.data_from === "custom";
      },
      isTrainData() {
        return this.fields.data_from === "traindata";
      }
    },

    methods: {
      handleFieldChange(event) {
        const field = event.target.name;
        if (field) {
          const value = this.fields[field];
          ctx.pushEvent("update_field", { field, value });
        }
      },
    },
  }).mount(ctx.root);

  ctx.handleEvent("update", ({ fields }) => {
    setValues(fields);
  });

  ctx.handleSync(() => {
    // Synchronously invokes change listeners
    document.activeElement &&
      document.activeElement.dispatchEvent(
        new Event("change", { bubbles: true })
      );
  });

  function setValues(fields) {
    for (const field in fields) {
      app.fields[field] = fields[field];
    }
  }
}
