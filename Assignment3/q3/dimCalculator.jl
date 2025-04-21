

println("\033c")
mutable struct SearchSpace
    length_values::Vector{BigFloat}
    search_range_low::BigFloat
    search_range_high::BigFloat
    search_range_shrinkratio::BigFloat
end
function shrink_search_range!(ss::SearchSpace)
    midpoint = (ss.search_range_low + ss.search_range_high) / 2
    Δrange = (ss.search_range_high - ss.search_range_low)*ss.search_range_shrinkratio
    ss.search_range_low = midpoint - Δrange / 2
    ss.search_range_high = midpoint + Δrange / 2
end
function perform_search!(ss::SearchSpace, arr::Vector{BigFloat})
    # println("SS_search_range_low: ", ss.search_range_low)
    # println("SS_search_range_high: ", ss.search_range_high)
    i_start = searchsortedfirst(arr, ss.search_range_low)

    i_end   = searchsortedlast(arr, ss.search_range_high)
    # println("i_start: ", i_start)
    # println("i_end: ", i_end)
    
    len = max(i_end - i_start + 1, 0)
    push!(ss.length_values, len)
end




function logisticmap(x::BigFloat, r::BigFloat)::BigFloat
    return r * x * (1 - x)
end

x = BigFloat("0.4")
r = BigFloat("3.5699457")

logratio = BigFloat("0.5")
iterations = 20000
convergence_iterations = 400
starting_range = BigFloat("0.1")
data_range = 20
points = Vector{BigFloat}()
for i in 1:iterations
    global x
    
    x = logisticmap(x, r)
    if i > convergence_iterations
        push!(points, x)
    end
end

# println("Number of points: ", length(points))
sorted_points::Vector{BigFloat} = sort(points)

search_ranges = Vector{SearchSpace}()
for i in 1:data_range
    # push!(search_ranges, BigFloat(i) / 100)
    point = rand(sorted_points)
    ss = SearchSpace(Vector{BigFloat}(), point-starting_range/2,  point+starting_range/2, logratio)
    push!(search_ranges, ss)
end

function log_point_counts(ranges_collection::Vector{SearchSpace}, points::Vector{BigFloat})
    # println("Inside log_point_counts")
    for ss in ranges_collection
        # println("Type of ss: ", typeof(ss))
        perform_search!(ss, points)
    end
end
function shrink_search_space(ranges_collection::Vector{SearchSpace})
    for ss in ranges_collection
        shrink_search_range!(ss)
    end
end
@assert issorted(sorted_points)
sorted_points = unique(sorted_points)
for i in 1:data_range
    log_point_counts(search_ranges, sorted_points)
    shrink_search_space(search_ranges)
end


ss2 = search_ranges[5]
println("ss2: ", ss2.length_values)
