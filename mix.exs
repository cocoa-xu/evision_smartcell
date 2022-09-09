defmodule EvisionSmartCell.MixProject do
  use Mix.Project

  def project do
    [
      app: :evision_smartcell,
      version: "0.1.0",
      elixir: "~> 1.12",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      mod: {EvisionSmartCell.Application, []}
    ]
  end

  defp deps do
    [
      {:kino, "~> 0.6.2"}
    ]
  end
end