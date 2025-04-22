### Corellation dimension
The corellatiion dimension of the logistic map at r = 3.5699456 is found to be 0.508±0.008

### To run:
Be sure to have julia installed before you run. 
In addition, when running the file, be sure to assign it more than one thread. 
```bash
julia --threads 10 dimCalculator.jl
```


### Workings

#### Generating the points
First the logistic map output is generated. Each thread generates its own set of points with a different starting value.

```julia
    points = Vector{BigFloat}()
    local x = BigFloat(rand())
    for i in 1:iterations
        x = logisticmap(x, r)
        if i > convergence_iterations
            push!(points, x)
        end
    end
```
The BigFloat type is used for its arbitrary precision. The first few iteration points are discarded to get rid of any transience

#### Creating boxes
A SearchSpace struct is defined to allow more modular code.

```julia
mutable struct SearchSpace
    length_values::Vector{BigFloat}
    search_range_low::BigFloat
    search_range_high::BigFloat
    search_range_shrinkratio::BigFloat
end
```
The `search_range_low` and `search_range_high` variables are the search range bounds. `search_range_shrinkratio` is by what geometric amount the range shrinks by every time.
```julia
function shrink_search_range!(ss::SearchSpace)
    midpoint = (ss.search_range_low + ss.search_range_high) / 2
    Δrange = (ss.search_range_high - ss.search_range_low)*ss.search_range_shrinkratio
    ss.search_range_low = midpoint - Δrange / 2
    ss.search_range_high = midpoint + Δrange / 2
end
```

The `length_values` keeps track of how many points it encountered within the bounds

A bunch of search ranges are created to average their values later.
```julia
search_ranges = Vector{SearchSpace}()

for i in 1:data_range
    point = rand(points)
    ss = SearchSpace(Vector{BigFloat}(), point-starting_range/2,  point+starting_range/2, logratio)
    push!(search_ranges, ss)
end
```

#### Finding number of points
The points array is first sorted to allow efficient searching.
```julia
sort(points)
```

```julia
function perform_search!(ss::SearchSpace, arr::Vector{BigFloat})
    i_start = searchsortedfirst(arr, ss.search_range_low)
    i_end   = searchsortedlast(arr, ss.search_range_high)
    len = max(i_end - i_start + 1, 0)
    push!(ss.length_values, len)
end
```

The range is then shrunk in a geometric progression and the points are logged.
```julia
sampling_iterations = 15
for i in 1:sampling_iterations
    log_point_counts(search_ranges, points)
    shrink_search_space(search_ranges)
end
```

#### Calculating corellation dimension

Between 2nd and 8th iteration of shinking+logging the slope of the logarithmic number of points vs the logarithm of the range size is found to be roughly constant. Ie: between 2nd(julia is 1 indexing) and 8th iteration, the graph is ~linear


```julia
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
```


The values computed by each thread is then averaged.

```julia
#Outside the thread
d_final = BigFloat("0")
d_lock = ReentrantLock()
```
```julia
# Inside the thread
d = compute_average_correlation_dimension(search_ranges, logratio)
@printf("Average Correlation Dimension: %.5f on Thread %d\n", d, Threads.threadid())
global d_final
@lock d_lock d_final += d
```
The lock is simply to prevent race conditions












#### Sample output
```sh
Available Threads: 10
Average Correlation Dimension: 0.50171 on Thread 1
Average Correlation Dimension: 0.50000 on Thread 3
Average Correlation Dimension: 0.52050 on Thread 6
Average Correlation Dimension: 0.51780 on Thread 4
Average Correlation Dimension: 0.50561 on Thread 10
Average Correlation Dimension: 0.50841 on Thread 8
Average Correlation Dimension: 0.50895 on Thread 5
Average Correlation Dimension: 0.48801 on Thread 2
Average Correlation Dimension: 0.50324 on Thread 9
Average Correlation Dimension: 0.50788 on Thread 7


Final Average Correlation Dimension: 0.50621
```