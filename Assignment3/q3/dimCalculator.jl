using Plots

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

r = BigFloat("3.5699456")

logratio = BigFloat("0.2")

iterations = 2000000
convergence_iterations = 40000
starting_range = BigFloat("0.4")
data_range = 20


points = Vector{BigFloat}()



x = BigFloat("0.1")
for i in 1:iterations
    global x
    x = logisticmap(x, r)
    if i > convergence_iterations
        push!(points, x)
    end
end

sorted_points::Vector{BigFloat} = sort(points)

search_ranges = Vector{SearchSpace}()


for i in 1:data_range
    point = rand(sorted_points)
    ss = SearchSpace(Vector{BigFloat}(), point-starting_range/2,  point+starting_range/2, logratio)
    push!(search_ranges, ss)
end

function log_point_counts(ranges_collection::Vector{SearchSpace}, points::Vector{BigFloat})
    for ss in ranges_collection
        perform_search!(ss, points)
    end
end
function shrink_search_space(ranges_collection::Vector{SearchSpace})
    for ss in ranges_collection
        shrink_search_range!(ss)
    end
end
function get_corelation_dimension(ss::SearchSpace, log_ratio::BigFloat)
    first_value = ss.length_values[2]
    last_value = ss.length_values[7]
    slope = (log(last_value) - log(first_value)) / 5
    d = slope/ log(log_ratio)
    return d
end


@assert issorted(sorted_points)
sorted_points = unique(sorted_points)
shrink_iterations = 15
for i in 1:shrink_iterations
    log_point_counts(search_ranges, sorted_points)
    shrink_search_space(search_ranges)
end


function compute_average_correlation_dimension(ranges_collection::Vector{SearchSpace}, log_ratio::BigFloat)
    total_dimension = BigFloat(0)
    for ss in ranges_collection
        total_dimension += get_corelation_dimension(ss, log_ratio)
    end
    return total_dimension / length(ranges_collection)

end

println("Average Correlation Dimension: ", compute_average_correlation_dimension(search_ranges, logratio))

