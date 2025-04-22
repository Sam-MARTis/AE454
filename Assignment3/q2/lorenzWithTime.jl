using Plots
# using BenchmarkTools
gr()
# plotlyjs()

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
# β = BigFloat("166")

σ = BigFloat("10")
β = BigFloat("8")/BigFloat("3")
# b = BigFloat("166")
b_min = BigFloat("166")
b_max = BigFloat("170")
db = BigFloat("0.2")

# x_min = BigFloat("-75")
# x_max = BigFloat("75")
# y_min = BigFloat("-125")
# y_max = BigFloat("125")
# z_min = BigFloat("75")
# z_max = BigFloat("300")

x = BigFloat("-7.13");
y = BigFloat("-7.11");
z = BigFloat("155.41");


iterations = 5000


dt = BigFloat("0.01")
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
# r_vals = b_min:db:b_max
r_vals = BigFloat.(b_min:db:b_max)
paths = length(r_vals)
points_array = Array{NTuple{3, BigFloat}, 2}(undef, iterations, paths)
plots = Array{Any, 1}(undef, paths)
time_values = dt:dt:(dt*iterations)
function lorenz(σ::BigFloat, ρ::BigFloat, β::BigFloat, x0::BigFloat, y0::BigFloat, z0::BigFloat, dt::BigFloat, iterations::Int)
    x = x0
    y = y0
    z = z0
    arr = Array{BigFloat, 1}(undef, iterations)
    for i in 1:iterations
        x, y, z = iterate(x, y, z, σ, ρ, β, dt)
        arr[i] = x
    end
    return arr
end
# println(r_vals)

plots = []

for i = 1:paths
    local b = r_vals[i]
    x_vals = lorenz(σ, b, β, x, y, z, dt, iterations)

    p = plot(
        time_values, x_vals,
        
        title = "r $(round(Float64(b), digits=2))",
        legend = false,
        margin = 1*Plots.mm,              
    )
    push!(plots, p)
end

rows = ceil(Int, sqrt(paths))
cols = ceil(Int, paths / rows)

tp = plot(plots..., layout = (rows, cols), size=(3500, 2400))

# display(tp)
savefig(tp, "bursts_r-variation.png")



