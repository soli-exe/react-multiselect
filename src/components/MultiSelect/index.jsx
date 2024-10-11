/* eslint-disable */
import { useState, useRef, useEffect, useImperativeHandle } from 'react';
import styled from 'styled-components';

const MultiSelectContainer = styled.div`
    position: relative;
    width: 400px;
`

const SelectedOptionsContainer = styled.div`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px;
    border: 2px solid ${props => props.$isOpen ? "#0050fc" : "#ccc"};
    padding: 5px;
    padding-right: 28px !important;
    border-radius: 5px;
`

const SelectOptionTag = styled.span`
    background-color: #e0e0e0;
    font-size: 11pt;
    padding: 4px 12px;
    font-weight: 500;
    border-radius: 5px;
    display: flex;
    align-items: center;

    button {
        background: none;
        width: 18px;
        height: 18px;
        border: none;
        cursor: pointer;
    }
`

const SelectInput = styled.input`
    border: none;
    outline: none;
    padding: 5px;
    flex-grow: 1;
    background-color: unset;
    `

const Button = styled.button`
    border-left: 1px solid lightgray !important;
    border: unset;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    margin-left: 5px;
    width: 30px;
    height: 30px;
    background-color: unset;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    svg {
        rotate:  ${props => props.$isOpen ? "180deg" : "0"};
    }

`

const Dropdown = styled.div`
        position: absolute;
        max-height: 200px;
        overflow-y: auto;
        width: 100%;
        border: 1px solid #ccc;
        background-color: white;
        z-index: 1;
        border-radius: 8px;
        margin-top: 3px;
        display: ${props => props.$isOpen ? "block" : "none"};

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    ul li {
        padding: 10px;
        cursor: pointer;
    }

    ul li:hover {
        background-color: #004ff82b !important;
    }
`

const MultiSelect = ({ defaultOptions, position = 'bottom', multiple = false, outPut }) => {
    // Local state
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [options, setOptions] = useState(defaultOptions);
    const [searchValue, setSearchValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState(defaultOptions);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    // Ref
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);


    useEffect(() => {
        setFilteredOptions(
            options.filter(option =>
                option.label.toLowerCase().includes(searchValue.toLowerCase())
            )
        );
    }, [searchValue, options]);

    useEffect(() => {
        if (selectedOptions.length) {
            // Return data in this function to be accessible from parent
            outPut(selectedOptions)
        }
    }, [selectedOptions])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !inputRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelectOption = (option) => {
        if (!selectedOptions.includes(option)) {
            if (multiple) {
                setSelectedOptions([...selectedOptions, option]);
            } else {
                setSelectedOptions([option])
            }
        }
        setSearchValue('');
        setIsOpen(false);
    };


    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true)
                }
                setFocusedIndex((prev) =>
                    prev < filteredOptions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredOptions[focusedIndex]) {
                    handleSelectOption(filteredOptions[focusedIndex]);
                }
                break;
            default:
                break;
        }
    };

    const removeSelectedOption = (optionToRemove) => {
        setSelectedOptions(
            selectedOptions.filter(option => option.id !== optionToRemove)
        );
    };

    const toggleDropdown = (e) => {
        e.stopPropagation()
        setIsOpen(prevState => !prevState);
    };


    return (
        <MultiSelectContainer>
            <SelectedOptionsContainer ref={inputRef} $isOpen={isOpen}>
                {selectedOptions.map(option => (
                    <SelectOptionTag key={option.id}>
                        {option.label}
                        <button onClick={() => removeSelectedOption(option.id)}>
                            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z" fill="#1C274C"></path> </g></svg>
                        </button>
                    </SelectOptionTag>
                ))}
                <SelectInput
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={"Cryptos"}
                    style={{ flexGrow: 1 }}
                    onFocus={() => setIsOpen(true)}
                />
                <Button $isOpen={isOpen} onClick={toggleDropdown}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 9L12 15L18 9" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </Button>
            </SelectedOptionsContainer>
            <Dropdown
                $isOpen={isOpen}
                ref={dropdownRef}
                style={{ top: position === 'bottom' ? 'auto' : 'unset', bottom: position === 'top' ? 'auto' : 'unset' }}
            >
                {
                    filteredOptions.length ?
                        <ul>
                            {filteredOptions.map((option, index) => (
                                <li key={option.id}
                                    onClick={() => {
                                        if (selectedOptions.includes(option)) {
                                            removeSelectedOption(option.id)
                                        } else {
                                            handleSelectOption(option)
                                        }
                                    }}
                                    style={{
                                        backgroundColor: focusedIndex === index ? '#004ff824' : selectedOptions.includes(option) ? "#ccc" : 'transparent',
                                    }}>
                                    {option.label}
                                </li>
                            ))}
                        </ul> :
                        <ul>
                            <li>No option</li>
                        </ul>
                }
            </Dropdown>
        </MultiSelectContainer >
    );
};

export default MultiSelect;
