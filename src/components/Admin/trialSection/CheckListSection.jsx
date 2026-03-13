import React from 'react'

const CheckListSection = ({ checkList, setCheckList }) => {

    const handleCheck = (e) => {
        const { name, checked } = e.target;
        setCheckList(prev => ({ ...prev, [name]: checked }));
    };

    return (
        <>
            <div className="mb-2">
                {/* <h5 className="section-title mb-3 text-primary">Checklist For Trial</h5> */}
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="isDocket"
                                id="isDocket"
                                checked={checkList?.isDocket}
                                onChange={handleCheck}
                            />
                            <label className="form-check-label" htmlFor="isDocket">
                                Is Docket
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckListSection