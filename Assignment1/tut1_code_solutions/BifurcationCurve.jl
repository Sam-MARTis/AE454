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
    roots = fourthOrderRealRoots(1, -2h, h^2 - R^2 + 1, -2h, h^2)
    validRoots = []
    for root in roots
        if actualFunction(root, h, R)
            push!(validRoots, root)
        end
    end
    return validRoots
end

hVals = LinRange(-5, 5, 100)
rVals = LinRange(-5, 5, 100)
zVals = Matrix{Float64}(undef, length(hVals), length(rVals)) 

for (i, h) in enumerate(hVals)
    for (j, R) in enumerate(rVals)
        validRoots = findVals(h, R)
        zVals[i, j] = length(validRoots) 
    end
end


heatmap(hVals, rVals, zVals, xlabel="h", ylabel="r", zlabel="Roots", title="Bifurcation Curve", interpolation=:linear, size=(1000, 1000))

savefig("./Bifurcation-Curve.html")
