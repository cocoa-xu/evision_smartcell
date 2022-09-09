defmodule EvisionSmartCell.Helper do
  @moduledoc false

  def quoted_var(nil), do: nil
  def quoted_var(string), do: {String.to_atom(string), [], nil}

  def to_update(value, type, opts \\ [])

  def to_update(value, :string, opts) do
    must_in = opts[:must_in] || [value]
    if Enum.member?(must_in, value) do
      value
    else
      nil
    end
  end

  def to_update(value, :boolean, _opts) do
    if is_binary(value) do
      case value do
        "true" -> true
        "false" -> false
        _ -> nil
      end
    else
      if is_boolean(value) do
        value
      else
        nil
      end
    end
  end

  def to_update(value, :integer, opts) do
    minimum = opts[:minimum]
    maximum = opts[:maximum]
    case Integer.parse(value) do
      {n, ""} ->
        n =
          if minimum != nil and n < minimum do
            minimum
          else
            n
          end
        if maximum != nil and n > maximum do
          maximum
        else
          n
        end
      _ -> nil
    end
  end

  def to_update(value, :number, opts) do
    minimum = opts[:minimum]
    maximum = opts[:maximum]
    case Float.parse(value) do
      {n, ""} ->
        n =
          if minimum != nil and n < minimum do
            minimum
          else
            n
          end
        if maximum != nil and n > maximum do
          maximum
        else
          n
        end
      _ -> nil
    end
  end

  @evision_types [:f32, :f64, :u8, :u16, :s8, :s16, :s32]
  def to_update(value , :type, opts) do
    allowed_types = opts[:allowed_types] || @evision_types
    if Enum.member?(allowed_types, String.to_atom(value)) do
      value
    else
      nil
    end
  end
end
