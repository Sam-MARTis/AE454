using Plots
STEP = 0.01
dt = 0.01
MAX = 2*π
OFFSET = π/2
RADIUS_MU = 2

θ = 0.0:STEP:MAX
θ = θ .+ OFFSET
r = [1.0 for i in θ]
μ = 0.1
function iterate(r, θ, μ, dt)
    for i in eachindex(θ)
        r[i] = r[i] + dt*r[i]*(1-r[i]^2 + μ*cos(θ[i]))
    end
end

plot()
for μ in -RADIUS_MU:0.1:RADIUS_MU
    for i in 1:100
        iterate(r, θ, μ, dt)
    end

    plot!(θ, r, label=μ, title="Diff sol", xlabel="t", ylabel="x", size=(800, 600), legend=:topright)

end

plot!(title="Diff sol", xlabel="t", ylabel="x")
savefig("./04/Rvsθ.png")



