using Plots
using Printf

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
    len = max(i_end - i_start + 1, 0)
    push!(ss.length_values, len)
end




function logisticmap(x::BigFloat, r::BigFloat)::BigFloat
    return r * x * (1 - x)
end

r = BigFloat("3.5699456")

logratio = BigFloat("0.2")

iterations = 3000000
convergence_iterations = 40000
starting_range = BigFloat("0.3")
data_range = 40

available_threads = Threads.nthreads()
println("Available Threads: ", available_threads)

d_final = BigFloat("0")
d_lock = ReentrantLock()



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
    start_idx = 2
    end_idx = 8
    first_value = ss.length_values[start_idx]
    last_value = ss.length_values[end_idx]
    slope = (log(last_value) - log(first_value)) / (end_idx - start_idx)
    d = slope/ log(log_ratio)
    return d
end
function compute_average_correlation_dimension(ranges_collection::Vector{SearchSpace}, log_ratio::BigFloat)
    total_dimension = BigFloat(0)
    for ss in ranges_collection
        total_dimension += get_corelation_dimension(ss, log_ratio)
    end
    return total_dimension / length(ranges_collection)
end


Threads.@threads for i in 1:available_threads

    points = Vector{BigFloat}()



    local x = BigFloat(rand())
    for i in 1:iterations
        x = logisticmap(x, r)
        if i > convergence_iterations
            push!(points, x)
        end
    end



    sort!(points)
    search_ranges = Vector{SearchSpace}()

    for i in 1:data_range
        point = rand(points)
        ss = SearchSpace(Vector{BigFloat}(), point-starting_range/2,  point+starting_range/2, logratio)
        push!(search_ranges, ss)
    end


    # @assert issorted(points)
    # points = unique(points)
    sampling_iterations = 15
    for i in 1:sampling_iterations
        log_point_counts(search_ranges, points)
        shrink_search_space(search_ranges)
    end



    d = compute_average_correlation_dimension(search_ranges, logratio)
    # println("Average Correlation Dimension: ", round(d, 5), " on Thread ", Threads.threadid())
    @printf("Average Correlation Dimension: %.5f on Thread %d\n", d, Threads.threadid())
    global d_final
    @lock d_lock d_final += d
end


@printf("\n\nFinal Average Correlation Dimension: %.5f", d_final / available_threads)