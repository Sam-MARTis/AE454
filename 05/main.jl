using Plots
println("\033c")
ϵ = 0.02
a = 1
Δt = 50
dt = 0.01
function xdot(x, y)
    return y
end
function ydot(x, y)
    return -x - ϵ * y
end

function iterate(x0, y0, h, n)
    x = zeros(n+1)
    y = zeros(n+1)
    t = zeros(n+1)
    x[1] = x0
    y[1] = y0
    for i in 1:n
        t[i+1] = t[i] + h
        x[i+1] = x[i] + h* xdot(x[i], y[i])
        y[i+1] = y[i] + h * ydot(x[i], y[i])
    end
    return x, t
end

function analyticalSol(t)
    return sqrt(4*(a^2)/(3*(a^2)*ϵ*t + 4))*cos(t)
    
end

x₀ = a 
y₀ = 0
n = Int(Δt / dt)
x, t = iterate(x₀, y₀, dt, n)
plot(t, x, label="Numerical", title="Diff sol", xlabel="t", ylabel="x")
plot!(t, analyticalSol.(t), label="Analytical", linestyle=:dash)
savefig("diff_sol_small-e.png")
