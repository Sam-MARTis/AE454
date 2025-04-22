using Plots
# using BenchmarkTools

plotlyjs()

print("\033c")
function ẋ(x::BigFloat, y::BigFloat, z::BigFloat, σ::BigFloat, ρ::BigFloat, β::BigFloat)
    return σ * (y - x)
end
function ẏ(x::BigFloat, y::BigFloat, z::BigFloat, σ::BigFloat, ρ::BigFloat, β::BigFloat)
    return x * (ρ - z) - y
end
function ż(x::BigFloat, y::BigFloat, z::BigFloat, σ::BigFloat, ρ::BigFloat, β::BigFloat)
    return x * y - (β * z)
end

# σ = BigFloat("10")
# b = BigFloat("8")/BigFloat("3")
# β = BigFloat("16")

σ = BigFloat("10")
β = BigFloat("8")/BigFloat("3")
b = BigFloat("166")


# x = BigFloat("-7.13");
# y = BigFloat("-7.11");
# z = BigFloat("155.41");
x_min = BigFloat("-20")
x_max = BigFloat("20")
y_min = BigFloat("-20")
y_max = BigFloat("20")
z_min = BigFloat("100")
z_max = BigFloat("200")

iterations = 50000
paths = 10


dt = BigFloat("0.003")
function iterate(x::BigFloat, y::BigFloat, z::BigFloat, σ::BigFloat, ρ::BigFloat, β::BigFloat, dt::BigFloat)
    #RK4
    k1x = ẋ(x, y, z, σ, ρ, β)
    k1y = ẏ(x, y, z, σ, ρ, β)
    k1z = ż(x, y, z, σ, ρ, β)
    k2x = ẋ(x + dt/2 * k1x, y + dt/2 * k1y, z + dt/2 * k1z, σ, ρ, β)
    k2y = ẏ(x + dt/2 * k1x, y + dt/2 * k1y, z + dt/2 * k1z, σ, ρ, β)
    k2z = ż(x + dt/2 * k1x, y + dt/2 * k1y, z + dt/2 * k1z, σ, ρ, β)
    k3x = ẋ(x + dt/2 * k2x, y + dt/2 * k2y, z + dt/2 * k2z, σ, ρ, β)
    k3y = ẏ(x + dt/2 * k2x, y + dt/2 * k2y, z + dt/2 * k2z, σ, ρ, β)
    k3z = ż(x + dt/2 * k2x, y + dt/2 * k2y, z + dt/2 * k2z, σ, ρ, β)
    k4x = ẋ(x + dt * k3x, y + dt * k3y, z + dt * k3z, σ, ρ, β)
    k4y = ẏ(x + dt * k3x, y + dt * k3y, z + dt * k3z, σ, ρ, β)
    k4z = ż(x + dt * k3x, y + dt * k3y, z + dt * k3z, σ, ρ, β)
    x += dt/6 * (k1x + 2*k2x + 2*k3x + k4x)
    y += dt/6 * (k1y + 2*k2y + 2*k3y + k4y)
    z += dt/6 * (k1z + 2*k2z + 2*k3z + k4z)
    return x, y, z
end
points_array = Array{NTuple{3, BigFloat}, 2}(undef, iterations, paths)
function lorenz(σ::BigFloat, ρ::BigFloat, β::BigFloat, x0::BigFloat, y0::BigFloat, z0::BigFloat, dt::BigFloat, iterations::Int, idx::Int)
    x = x0
    y = y0
    z = z0
    points = Vector{NTuple{3, BigFloat}}()
    for i in 1:iterations
        x, y, z = iterate(x, y, z, σ, ρ, β, dt)
        points_array[i, idx] =  (x, y, z)
    end
end


# @time scatter3d([x], [y], [z], markersize=2)

start_values = Vector{NTuple{3, BigFloat}}()
for i in 1:paths
    push!(start_values, (x_min + (x_max - x_min) * rand(BigFloat), y_min + (y_max - y_min) * rand(BigFloat), z_min + (z_max - z_min) * rand(BigFloat)))
end

Threads.@threads for i in 1:paths
    lorenz(σ, b, β, start_values[i][1], start_values[i][2], start_values[i][3], dt, iterations, i)
end

lorenz_plot = plot(
    xlabel="X", ylabel="Y", zlabel="Z",
    title="Lorenz Attractor in 3D",
    legend=false
)

for i = 1:paths
    x_vals = [p[1] for p in points_array[:, i]]
    y_vals = [p[2] for p in points_array[:, i]]
    z_vals = [p[3] for p in points_array[:, i]]
    # colour = HSL(clamp(i / paths, 0.0, 1.0), 1.0, 0.5)
    colour = RGB(HSL(Float64(i)/paths, 1, 0.5))

    println("Colour: ", colour)
    # println(i/paths)

    scatter3d!( [start_values[i][1]], [start_values[i][2]], [start_values[i][3]],
               markersize=2, label="", color=colour)

    plot!( x_vals, y_vals, z_vals,
          label="", color=colour)
end

display(lorenz_plot)



# xs, ys, zs = map(x -> getindex.(x, 1), points_array[:, idx]),
#               map(x -> getindex.(x, 2), points_array[:, idx]),
#               map(x -> getindex.(x, 3), points_array[:, idx])

# plot!(xs, ys, zs;
#     label="Lorenz Attractor",
#     xlabel="X", ylabel="Y", zlabel="Z",
#     title="Lorenz Attractor in 3D",
#     legend=false, color=:blue)

# lorenz(σ, b, β, x, y, z, dt, iterations, idx)
# x_vals = [p[1] for p in points_array]
# y_vals = [p[2] for p in points_array]
# z_vals = [p[3] for p in points_array]
# plot!(x_vals, y_vals, z_vals, label="Lorenz Attractor", xlabel="X", ylabel="Y", zlabel="Z", title="Lorenz Attractor in 3D", legend=false, color=:blue)
# plot!(x_vals, y_vals, z_vals, label="", xlabel="X", ylabel="Y", zlabel="Z", title="Lorenz Attractor in 3D", legend=false)


