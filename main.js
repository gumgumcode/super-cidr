// SELECTORS

let input_ip = document.getElementById('input-ip')
let input_cidr = document.getElementById('input-cidr')

let outputs = document.getElementById('outputs')
let output_ip_range = document.getElementById('output-ip-range')
let output_ip_list = document.getElementById('output-ip-list')
let output_error = document.getElementById('output-error')

// EVENT LISTENERS

document.getElementById('submit-btn').addEventListener('click', main)
document.getElementById('reset-btn').addEventListener('click', reset_output)

// CONSTANTS

const MAX_OCTET = 255
const MAX_CIDR = 32
const MIN_CIDR = 15

// OPTIONS

let ip = null
let count = null
let ip_list = null

// GETTERS AND SETTERs

function get_ip_val() {
    let ip_val = input_ip.value ? input_ip.value.split('.').map(x => Number(x)) : [192, 168, 0, 1]

    ip_val.forEach(octet => {
        if (!is_valid_octet(octet)) {
            throw new Error('Invalid IP')
        }
    })

    return ip_val
}

function get_cidr_val() {
    let cidr_val = input_cidr.value ? Number(input_cidr.value) : 28

    if (cidr_val < MIN_CIDR || cidr_val > MAX_CIDR) {
        throw new Error('Invalid CIDR Range. Try a value between 16 and 32.')
    } else {
        return cidr_val
    }
}

function set_ip(ip_val) {
    ip_val.forEach((octet, index) => {
        ip[index][0] = octet
    })
}

function get_ip_count(cidr) {
    return Math.pow(2, 32 - cidr)
}

function set_ip_count(cidr) {
    count = Math.pow(2, 32 - cidr)
}

function generate_output() {
    let output = ''
    ip_list.forEach(ip => {
        output += ip + '<br>'
    })
    output_ip_list.innerHTML += output
    output_ip_range.innerHTML = 'Number of IPs: ' + get_ip_count(get_cidr_val())
}

function reset_output() {
    ip = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ]
    count = 0
    ip_list = []
    output_ip_range.innerHTML = ''
    output_ip_list.innerHTML = ''
}

// CONDITION CHECKS

function is_valid_octet(num) {
    if (num >=0 && num < 256) {
        return true
    }
    return false
}

// CORE FUNCTIONS

function increment_octet_count(i) {

    // reset octets on the right
    for (let j = i + 1; j <= 3; j++) {
        ip[j][0] = 0
        ip[j][1] = 0
    }

    // increment octet
    if (ip[i][0] === MAX_OCTET) {
        ip[i][0] = 0
    } else {
        ip[i][0] += 1
    }
    store_ip()

    // increment octet_count
    ip[i][1] += 1
}

function process_ips() {
    while (count > 0) {
        if (ip[3][1] < MAX_OCTET) {
            increment_octet_count(3)
        } else if (ip[2][1] < MAX_OCTET) {
            increment_octet_count(2)
        } else if (ip[1][1] < MAX_OCTET) {
            increment_octet_count(1)
        } else if (ip[0][1] < MAX_OCTET) {
            increment_octet_count(0)
        }
        count--
    }
}

function store_ip() {
    let ip_string = ip[0][0] + '.' + ip[1][0] + '.' + ip[2][0] + '.' + ip[3][0]
    ip_list.push(ip_string)
}

// MAIN

function main() {
    try {
        // Clear output
        reset_output()

        // Set globals using input
        set_ip(get_ip_val())
        set_ip_count(get_cidr_val())

        // Store first IP
        store_ip()
        count--

        // Final processing
        process_ips()
        generate_output()
    }
    catch (error) {
        output_error.innerHTML = 'Check console for errors!'
        console.error(error)
    }
}

main()