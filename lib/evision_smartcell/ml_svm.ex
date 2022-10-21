defmodule EvisionSmartCell.ML.SVM do
  use Kino.JS, assets_path: "lib/assets"
  use Kino.JS.Live
  use Kino.SmartCell, name: "Evision: Support Vector Machine"

  alias EvisionSmartCell.Helper, as: ESCH
  alias EvisionSmartCell.ML.TrainData

  @smartcell_id "evision.ml.svm"

  @properties %{
    "data_from" => %{
      :type => :string,
      :opts => [must_in: ["traindata_var", "traindata"]],
      :default => "traindata_var"
    },
    "traindata_var" => %{
      :type => :string,
      :default => "dataset"
    },

    # SVM
    "type" => %{
      :type => :string,
      :opts => [must_in: ["C_SVC", "NU_SVC", "ONE_CLASS", "EPS_SVR", "NU_SVR"]],
      :default => "C_SVC"
    },
    "kernel_type" => %{
      :type => :string,
      :opts => [must_in: ["LINEAR", "POLY", "RBF", "SIGMOID", "CHI2", "INTER", "CUSTOM"]],
      :default => "RBF"
    },
    "to_variable" => %{
      :type => :string,
      :default => "svm"
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
  @inner_to_module %{
    "traindata" => TrainData
  }

  @spec id :: String.t()
  def id, do: @smartcell_id

  @spec properties :: map()
  def properties, do: @properties

  @spec defaults :: map()
  def defaults do
    Map.new(Enum.map(@properties, fn {field, field_specs} ->
      {field, field_specs[:default]}
    end))
  end

  @impl true
  def init(attrs, ctx) do
    # load from file or fill empty entries with default values
    fields =
      Map.new(Enum.map(@properties, fn {field, field_specs} ->
        {field, attrs[field] || field_specs[:default]}
      end))

    # traindata
    key = "traindata"
    fields = ESCH.update_key_with_module(fields, key, @inner_to_module[key], fn fields, key ->
      fields["data_from"] == key
    end)

    info = [id: @smartcell_id, fields: fields]
    {:ok, assign(ctx, info)}
  end

  @impl true
  def handle_connect(ctx) do
    {:ok, %{id: ctx.assigns.id, fields: ctx.assigns.fields}, ctx}
  end

  @impl true
  def handle_event("update_field", %{"field" => field, "value" => value}, ctx) do
    updated_fields =
      case String.split(field, ".", parts: 2) do
        [inner, forward] ->
          ESCH.to_inner_updates(inner, @inner_to_module[inner], forward, value, ctx)
        [field] ->
          to_updates(ctx.assigns.fields, field, value)
      end
    ctx = update(ctx, :fields, &Map.merge(&1, updated_fields))
    broadcast_event(ctx, "update", %{"fields" => updated_fields})
    {:noreply, ctx}
  end

  def to_updates(_fields, name="data_from", value) do
    property = @properties[name]
    fields = %{name => ESCH.to_update(value, property[:type], Access.get(property, :opts))}

    key = "traindata"
    ESCH.update_key_with_module(fields, key, @inner_to_module[key], fn fields, key ->
      fields["data_from"] == key
    end)
  end

  def to_updates(_fields, name, value) do
    property = @properties[name]
    %{name => ESCH.to_update(value, property[:type], Access.get(property, :opts))}
  end

  @impl true
  def to_attrs(%{assigns: %{fields: fields}}) do
    fields
  end

  @impl true
  def to_source(attrs) do
    get_quoted_code(attrs)
    |> Kino.SmartCell.quoted_to_string()
  end

  def get_quoted_code(attrs) do
    quote do
      unquote(ESCH.quoted_var(attrs["to_variable"])) =
        Evision.ML.SVM.create()
        |> Evision.ML.SVM.setType(unquote(ESCH.quoted_var("Evision.cv_#{attrs["type"]}()")))
        |> Evision.ML.SVM.setKernel(unquote(ESCH.quoted_var("Evision.cv_#{attrs["kernel_type"]}()")))

      unquote(set_term_criteria(attrs))
      unquote(train_on_dataset(attrs))
    end
  end

  defp set_term_criteria(attrs=%{"term_criteria_type" => "max_count", "term_criteria_count" => count, "term_criteria_eps" => eps}) do
    quote do
      unquote(ESCH.quoted_var(attrs["to_variable"])) = Evision.ML.SVM.setTermCriteria(unquote(ESCH.quoted_var(attrs["to_variable"])), {Evision.cv_MAX_ITER(), unquote(count), unquote(eps)})
    end
  end

  defp set_term_criteria(attrs=%{"term_criteria_type" => "eps", "term_criteria_count" => count, "term_criteria_eps" => eps}) do
    quote do
      unquote(ESCH.quoted_var(attrs["to_variable"])) = Evision.ML.SVM.setTermCriteria(unquote(ESCH.quoted_var(attrs["to_variable"])), {Evision.cv_EPS(), unquote(count), unquote(eps)})
    end
  end

  defp set_term_criteria(attrs=%{"term_criteria_type" => "max_count+eps", "term_criteria_count" => count, "term_criteria_eps" => eps}) do
    quote do
      unquote(ESCH.quoted_var(attrs["to_variable"])) = Evision.ML.SVM.setTermCriteria(unquote(ESCH.quoted_var(attrs["to_variable"])), {Evision.cv_MAX_ITER() + Evision.cv_EPS(), unquote(count), unquote(eps)})
    end
  end

  defp train_on_dataset(%{"data_from" => "traindata_var", "traindata_var" => traindata_var, "to_variable" => to_variable}) do
    quote do
      Evision.ML.SVM.train(unquote(ESCH.quoted_var(to_variable)), unquote(ESCH.quoted_var(traindata_var)))

      unquote(ESCH.quoted_var(to_variable))
      |> Evision.ML.SVM.calcError(unquote(ESCH.quoted_var(traindata_var)), false)
      |> then(&IO.puts("Training Error: #{elem(&1, 0)}"))

      unquote(ESCH.quoted_var(to_variable))
      |> Evision.ML.SVM.calcError(unquote(ESCH.quoted_var(traindata_var)), true)
      |> then(&IO.puts("Test Error: #{elem(&1, 0)}"))
    end
  end

  defp train_on_dataset(%{"data_from" => "traindata", "traindata" => traindata_attrs, "to_variable" => to_variable}) do
    dataset_variable = traindata_attrs["to_variable"]
    quote do
      unquote(TrainData.get_quoted_code(traindata_attrs))
      Evision.ML.SVM.train(unquote(ESCH.quoted_var(to_variable)), unquote(ESCH.quoted_var(dataset_variable)))

      unquote(ESCH.quoted_var(to_variable))
      |> Evision.ML.SVM.calcError(unquote(ESCH.quoted_var(dataset_variable)), false)
      |> then(&IO.puts("Training Error: #{elem(&1, 0)}"))

      unquote(ESCH.quoted_var(to_variable))
      |> Evision.ML.SVM.calcError(unquote(ESCH.quoted_var(dataset_variable)), true)
      |> then(&IO.puts("Test Error: #{elem(&1, 0)}"))
    end
  end
end
