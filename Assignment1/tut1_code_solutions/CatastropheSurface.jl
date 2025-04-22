using Plots
using PolynomialRoots
plotlyjs()

function fourthOrderRealRoots(a, b, c, d, e)
    coeffs = [e, d, c, b, a]
    return [real(root) for root in roots(coeffs) if abs(imag(root)) < 0.001]
end

function actualFunction(x, h, R)
    val = (1-h/x) - R/(sqrt(1+x^2))
    return abs(val) < 0.001
end

function findVals(h, R)
    
    roots = fourthOrderRealRoots(1, -2h, h^2 - R^2 +1, -2h, h^2)
    validRoots = []
    for root in roots
        if actualFunction(root, h, R)
            push!(validRoots, root)
        end
    end
    return validRoots
end

hVals = LinRange(-50, 50, 100)
rVals = LinRange(-50, 50, 100)
xVals = Float64[]
yVals = Float64[]
zVals = Float64[]

for h in hVals
    for R in rVals
        validRoots = findVals(h, R)
        print
        for root in validRoots
            push!(xVals, h)
            push!(yVals, R-1)
            push!(zVals, root)
        end
    end
end

scatter3d(xVals, yVals, zVals, xlabel="h", ylabel="r", zlabel="Roots", title="Catastrophe Surface", markersize=0.05, size = (1000, 1000))
savefig("./Catastrophe-Surface.html")