defmodule EvisionSmartCell.ML.RTrees do
  use Kino.JS, assets_path: "lib/assets/ML/RTrees"
  use Kino.JS.Live
  use Kino.SmartCell, name: "Evision: Random Forest"

  alias EvisionSmartCell.Helper, as: ESCH

  @properties %{
    "data_from" => %{
      :type => :string,
      :opts => [must_in: ["traindata", "custom"]],
      :default => "traindata"
    },

    # traindata
    "traindata" => %{
      :type => :string,
      :default => "dataset"
    },

    # custom
    "x" => %{
      :type => :string,
    },
    "x_type" => %{
      :type => :string,
      :opts => [must_in: ["s32", "f32"]],
      :default => "f32"
    },
    "y" => %{
      :type => :string,
    },
    "y_type" => %{
      :type => :string,
      :opts => [must_in: ["s32", "f32"]],
      :default => "s32"
    },
    "data_layout" => %{
      :type => :string,
      :opts => [must_in: ["row", "col"]],
      :default => "row"
    },
    "split_ratio" => %{
      :type => :number,
      :opts => [minimum: 0.0, maximum: 1.0],
      :default => "0.8"
    },
    "shuffle_dataset" => %{
      :type => :boolean,
      :default => true
    },
    "dataset_to_variable" => %{
      :type => :string,
      :default => "dataset"
    },

    # DTrees
    "max_depth" => %{
      :type => :integer,
      :opts => [minimum: 1],
      :default => 4
    },
    "max_categories" => %{
      :type => :integer,
      :opts => [minimum: 2],
      :default => 2
    },
    "min_sample_count" => %{
      :type => :integer,
      :opts => [minimum: 1],
      :default => 10
    },
    "cv_folds" => %{
      :type => :integer,
      :opts => [minimum: 0],
      :default => 0
    },

    # RTrees
    "active_var_count" => %{
      :type => :integer,
      :opts => [minimum: 0],
      :default => 0
    },
    "calculate_var_importance"  => %{
      :type => :boolean,
      :default => false
    },
    "to_variable" => %{
      :type => :string,
      :default => "rtree"
    },

    # TermCriteria
    "term_criteria_type" => %{
      :type => :string,
      :opts => [must_in: ["max_count", "eps", "max_count+eps"]],
      :default => "max_count"
    },
    "term_criteria_count" => %{
      :type => :integer,
      :opts => [minimum: 0],
      :default => 10
    },
    "term_criteria_eps" => %{
      :type => :number,
      :default => 0
    },
  }
  @default_keys Map.keys(@properties)

  @impl true
  def init(attrs, ctx) do
    fields =
      Enum.map(@properties, fn {field, field_specs} ->
        {field, attrs[field] || field_specs[:default]}
      end)

    {:ok, assign(ctx, fields: Map.new(fields))}
  end

  @impl true
  def handle_connect(ctx) do
    {:ok, %{fields: ctx.assigns.fields}, ctx}
  end

  @impl true
  def handle_event("update_field", %{"field" => field, "value" => value}, ctx) do
    updated_fields = to_updates(ctx.assigns.fields, field, value)
    ctx = update(ctx, :fields, &Map.merge(&1, updated_fields))
    broadcast_event(ctx, "update", %{"fields" => updated_fields})
    {:noreply, ctx}
  end

  defp to_updates(_fields, name, value) do
    property = @properties[name]
    %{name => ESCH.to_update(value, property[:type], Access.get(property, :opts))}
  end

  @impl true
  def to_attrs(%{assigns: %{fields: fields}}) do
    Map.take(fields, @default_keys)
  end

  @impl true
  def to_source(attrs) do
    get_quoted_code(attrs)
    |> Kino.SmartCell.quoted_to_string()
  end

  def get_quoted_code(attrs) do
    quote do
      unquote(ESCH.quoted_var(attrs["to_variable"])) =
        Evision.ML.RTrees.create!()
        |> Evision.ML.RTrees.setMaxDepth!(unquote(attrs["max_depth"]))
        |> Evision.ML.RTrees.setMaxCategories!(unquote(attrs["max_categories"]))
        |> Evision.ML.RTrees.setCVFolds!(unquote(attrs["cv_folds"]))
        |> Evision.ML.RTrees.setMinSampleCount!(unquote(attrs["min_sample_count"]))
        |> Evision.ML.RTrees.setActiveVarCount!(unquote(attrs["active_var_count"]))
        |> Evision.ML.RTrees.setCalculateVarImportance!(unquote(attrs["calculate_var_importance"]))

      unquote(set_term_criteria(attrs))
      unquote(train_on_dataset(attrs))
    end
  end

  defp set_term_criteria(attrs=%{"term_criteria_type" => "max_count", "term_criteria_count" => count, "term_criteria_eps" => eps}) do
    IO.puts("eps: #{inspect(eps)}")
    quote do
      unquote(ESCH.quoted_var(attrs["to_variable"])) = Evision.ML.RTrees.setTermCriteria!(unquote(ESCH.quoted_var(attrs["to_variable"])), {Evision.cv_MAX_ITER(), unquote(count), unquote(eps)})
    end
  end

  defp set_term_criteria(attrs=%{"term_criteria_type" => "eps", "term_criteria_count" => count, "term_criteria_eps" => eps}) do
    IO.puts("eps: #{inspect(eps)}")
    quote do
      unquote(ESCH.quoted_var(attrs["to_variable"])) = Evision.ML.RTrees.setTermCriteria!(unquote(ESCH.quoted_var(attrs["to_variable"])), {Evision.cv_EPS(), unquote(count), unquote(eps)})
    end
  end

  defp set_term_criteria(attrs=%{"term_criteria_type" => "max_count+eps", "term_criteria_count" => count, "term_criteria_eps" => eps}) do
    IO.puts("eps: #{inspect(eps)}")
    quote do
      unquote(ESCH.quoted_var(attrs["to_variable"])) = Evision.ML.RTrees.setTermCriteria!(unquote(ESCH.quoted_var(attrs["to_variable"])), {Evision.cv_MAX_ITER() + Evision.cv_EPS(), unquote(count), unquote(eps)})
    end
  end

  defp train_on_dataset(%{"data_from" => "traindata", "traindata" => traindata_variable, "to_variable" => to_variable}) do
    quote do
      Evision.ML.RTrees.train!(unquote(ESCH.quoted_var(to_variable)), unquote(ESCH.quoted_var(traindata_variable)))

      unquote(ESCH.quoted_var(to_variable))
      |> Evision.ML.RTrees.calcError!(unquote(ESCH.quoted_var(traindata_variable)), false)
      |> then(&IO.puts("Training Error: #{elem(&1, 0)}"))

      unquote(ESCH.quoted_var(to_variable))
      |> Evision.ML.RTrees.calcError!(unquote(ESCH.quoted_var(traindata_variable)), true)
      |> then(&IO.puts("Test Error: #{elem(&1, 0)}"))
    end
  end

  defp train_on_dataset(attrs=%{"data_from" => "custom", "dataset_to_variable" => dataset_to_variable, "to_variable" => to_variable}) do
    quote do
      unquote(ESCH.quoted_var(dataset_to_variable)) =
        Evision.ML.TrainData.create!(
          Evision.Nx.to_mat!(Nx.tensor(unquote(ESCH.quoted_var(attrs["x"])), type: unquote(String.to_atom(attrs["x_type"])), backend: Evision.Backend)),
          unquote(data_layout(attrs["data_layout"])),
          Evision.Nx.to_mat!(Nx.tensor(unquote(ESCH.quoted_var(attrs["y"])), type: unquote(String.to_atom(attrs["y_type"])), backend: Evision.Backend))
        )
        |> Evision.ML.TrainData.setTrainTestSplitRatio!(unquote(ESCH.quoted_var(attrs["split_ratio"])), shuffle: unquote(attrs["shuffle_dataset"]))

      Evision.ML.RTrees.train!(unquote(ESCH.quoted_var(to_variable)), unquote(ESCH.quoted_var(dataset_to_variable)))

      unquote(ESCH.quoted_var(to_variable))
      |> Evision.ML.RTrees.calcError!(unquote(ESCH.quoted_var(dataset_to_variable)), false)
      |> then(&IO.puts("Training Error: #{elem(&1, 0)}"))

      unquote(ESCH.quoted_var(to_variable))
      |> Evision.ML.RTrees.calcError!(unquote(ESCH.quoted_var(dataset_to_variable)), true)
      |> then(&IO.puts("Test Error: #{elem(&1, 0)}"))
    end
  end

  defp data_layout("row") do
    quote do
      Evision.cv_ROW_SAMPLE()
    end
  end

  defp data_layout("col") do
    quote do
      Evision.cv_COL_SAMPLE()
    end
  end
end
