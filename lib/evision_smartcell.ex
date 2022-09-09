defmodule EvisionSmartCell.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    smartcells = [
      EvisionSmartCell.ML.DTrees,
      EvisionSmartCell.ML.TrainData
    ]
    Enum.each(smartcells, fn sc -> Kino.SmartCell.register(sc) end)

    children = []
    opts = [strategy: :one_for_one, name: EvisionSmartCell.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
