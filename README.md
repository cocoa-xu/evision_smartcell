# EvisionSmartCell

A collection of SmartCell for Evision.

Available smartcells:

| Small Cell                      | Module              |
|:-------------------------------:|:-------------------:|
| Evision: Support Vector Machine | `Evision.ML.SVM`    |
| Evision: Decision Tree          | `Evision.ML.DTrees` |
| Evision: Random Forest          | `Evision.ML.RTrees` |

## Installation

```elixir
def deps do
  [
    {:evision_smartcell, "~> 0.3.0", github: "cocoa-xu/evision_smartcell"}
  ]
end

If [available in Hex](https://hex.pm/docs/publish), the package can be installed
by adding `evision_smartcell` to your list of dependencies in `mix.exs`:

```elixir
def deps do
  [
    {:evision_smartcell, "~> 0.3.0"}
  ]
end
```

Documentation can be generated with [ExDoc](https://github.com/elixir-lang/ex_doc)
and published on [HexDocs](https://hexdocs.pm). Once published, the docs can
be found at <https://hexdocs.pm/evision_smartcell>.

