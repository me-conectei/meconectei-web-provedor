import DashboardContext from "pages/Dashboard/context";
import UserSessionContext from "./UserSessionContext";
import UserContext from "pages/Users/context";
import CompanieContext from "pages/Requests/context";
import EvaluationContext from "pages/Evaluations/context";
import SupportContext from "pages/Support/context";
import PessoasInteressadasContext from "pages/PessoasInteressadas/context";

export const StoreProvider = ({ children }) => {
    return (
        <UserSessionContext>
            <DashboardContext>
                <UserContext>
                    <CompanieContext>
                        <EvaluationContext>
                            <SupportContext>
                                <PessoasInteressadasContext>
                                    {children}
                                </PessoasInteressadasContext>
                            </SupportContext>
                        </EvaluationContext>
                    </CompanieContext>
                </UserContext>
            </DashboardContext>
        </UserSessionContext>
    );
};